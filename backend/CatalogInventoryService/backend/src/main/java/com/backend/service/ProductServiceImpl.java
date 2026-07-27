package com.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custom_exceptions.ResourceAlreadyExistsException;
import com.backend.custom_exceptions.ResourceNotFoundException;
import com.backend.dtos.request.ProductAddRequest;
import com.backend.dtos.request.ProductUpdateRequest;
import com.backend.dtos.request.ProductVariantRequest;
import com.backend.dtos.response.ApiResponse;
import com.backend.dtos.response.BrandResponse;
import com.backend.dtos.response.CategoryResponse;
import com.backend.dtos.response.PendingProductResponse;
import com.backend.dtos.response.ProductResponse;
import com.backend.dtos.response.ProductSummaryResponse;
import com.backend.dtos.response.SubCategoryResponse;
import com.backend.entites.mongo.Brand;
import com.backend.entites.mongo.Category;
import com.backend.entites.mongo.Product;
import com.backend.entites.mongo.ProductStatus;
import com.backend.entites.mongo.ProductVariant;
import com.backend.entites.mongo.SubCategory;
import com.backend.repository.BrandRepository;
import com.backend.repository.CategoryRepository;
import com.backend.repository.ProductRepository;
import com.backend.repository.SubCategoryRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
	
	private final ProductRepository productRepo;
	private final CategoryService catService;
	private final SubCategoryService subCatService;
	private final BrandService brandService;
	private final ModelMapper mapper;

	@Override
	public ApiResponse addProduct(ProductAddRequest prod) {
		
		// Category, Brand, SubCategory Validation
		catService.validateCategory(prod.getCategoryId());
		subCatService.validateSubCat(prod.getSubCategoryId());
		brandService.validateBrand(prod.getBrandId());
		
		// Mapping Product
		Product product = mapper.map(prod, Product.class);

		product.setStatus(ProductStatus.PENDING);
		
		product.setCreatedByRetailerId("tempRetailer");

		product.setCreatedAt(LocalDateTime.now());

		product.setUpdatedAt(LocalDateTime.now());
		
		// Setting up product variants 
		for (ProductVariant variant : product.getVariants()) {

	        variant.setVariantId(UUID.randomUUID().toString());
	        variant.setActive(false);
	        
	    }

	    productRepo.save(product);
	    
	    return new ApiResponse("SUCCESS", "Product added successfully");  
	}

	@Override
	public List<PendingProductResponse> getAllPending() {
		
		List<Product> prods = productRepo.findAllByStatus(ProductStatus.PENDING);
		
		List<PendingProductResponse> dtoResp = new ArrayList<>();
		
		for(Product prod: prods) {
			
			PendingProductResponse dto = mapper.map(prod, PendingProductResponse.class);
			
			BrandResponse brand = brandService.getBrandById(prod.getBrandId());
			dto.setBrandName(brand.getName());
			
			SubCategoryResponse subCategory =  subCatService.getSubCategoryById(prod.getSubCategoryId());
			dto.setSubCategoryName(subCategory.getName());
			
			dto.setRetailerName(prod.getCreatedByRetailerId());
			
			dtoResp.add(dto);
		}
		
		return dtoResp;
	}

	@Override
	public ApiResponse approveProduct(String id, String productCode) {
		
		Product product = productRepo.findById(id)
				.orElseThrow(() ->
					new ResourceNotFoundException("Product Not Found!!"));
		
		if(productRepo.existsByProductCode(productCode)) {
			throw new ResourceAlreadyExistsException("ProductCode Must be unique!!");
		}
		
		product.setStatus(ProductStatus.APPROVED);
		product.setApprovedAt(LocalDateTime.now());
		product.setUpdatedAt(LocalDateTime.now());
		product.setApprovedByAdminId("tempAdminId");
		product.setProductCode(productCode);
		
		int sequence = 1;
		for(ProductVariant variant: product.getVariants()) {
			
			BrandResponse brand = brandService.getBrandById(product.getBrandId());
			
			String sku = brand.getCode() + "-"
	                + productCode + "-"
	                + String.format("%03d", sequence++);
			
			variant.setSku(sku);
			variant.setActive(true);
		}
		
		product.setNextSku(sequence);
		
		productRepo.save(product);
		
		return new ApiResponse("SUCCESS", "Product Approved Successfully");
	}

	@Override
	public ApiResponse addVariant(String productId, @Valid ProductVariantRequest prodVarReq) {
		Product product = productRepo.findById(productId)
		        .orElseThrow(() ->
				new ResourceNotFoundException("Product Not Found!!"));

		BrandResponse brand = brandService.getBrandById(product.getBrandId());

		int sequence = product.getNextSku();

		ProductVariant variant = mapper.map(prodVarReq, ProductVariant.class);

		variant.setVariantId(UUID.randomUUID().toString());

		String sku = brand.getCode() + "-"
                + product.getProductCode() + "-"
                + String.format("%03d", sequence++);
		
		variant.setSku(sku);
		
		variant.setActive(true);

		product.getVariants().add(variant);

		product.setNextSku(sequence);

		productRepo.save(product);
		
		return new ApiResponse("SUCCESS", "Product Variant Added Successfully");
	}

	@Override
	public List<ProductSummaryResponse> getViewProducts() {
		
		List<Product> products = productRepo
		            .findAllByStatus(ProductStatus.APPROVED);
		
		return toProductSummaryList(products);
	}

	@Override
	public ProductResponse getProduct(String id) {

		Product prod = productRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));
		
		List<ProductVariant> activeVariants = new ArrayList<>();

		for (ProductVariant variant : prod.getVariants()) {
		    if (Boolean.TRUE.equals(variant.getActive())) {
		        activeVariants.add(variant);
		    }
		}

		prod.setVariants(activeVariants);
		
		ProductResponse resp = mapper.map(prod, ProductResponse.class);

	    CategoryResponse category = catService.getCategoryById(prod.getSubCategoryId());
	    resp.setCategoryName(category.getName());

	    SubCategoryResponse subCategory = subCatService.getSubCategoryById(prod.getSubCategoryId());
	    resp.setSubCategoryName(subCategory.getName());

	    BrandResponse brand = brandService.getBrandById(prod.getBrandId());
	    resp.setBrandName(brand.getName());
	    
	    return resp;
		
	}

	@Override
	public ApiResponse rejectProduct(String id, String reason) {
		
		Product prod = productRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));
		
		prod.setStatus(ProductStatus.REJECTED);
		prod.setRejectionReason(reason);
		
		productRepo.save(prod);
		
		return new ApiResponse("Success", "Product Rejection Success!!");
	}

	@Override
	public ApiResponse deleteProduct(String id) {
		
		Product prod = productRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));
		
		prod.setStatus(ProductStatus.DISABLED);
		
		for(ProductVariant variant: prod.getVariants()) {
			variant.setActive(false);
		}
		
		productRepo.save(prod);
		
		return new ApiResponse("Success", "Product Deletion Success!!");
	}

	@Override
	public ApiResponse deleteProductVariant(String pid, String vid) {
		
		Product prod = productRepo.findById(pid)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));
		
		for(ProductVariant variant: prod.getVariants()) {
			if(variant.getVariantId().equals(vid)) {
				variant.setActive(false);
			}
		}
		
		productRepo.save(prod);
		
		return new ApiResponse("Success", "Product Variant Deleted!!");
	}

	@Override
	public ApiResponse updateProduct(String id, ProductUpdateRequest prod) {
		
		Product product = productRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));
		
		mapper.map(prod, product);
		
		productRepo.save(product);
		
		return new ApiResponse("Success", "Product updated Successfully!!");
	}

	@Override
	public ApiResponse updateProductVariant(String pid, String vid, ProductVariantRequest var) {
		
		Product product = productRepo.findById(pid)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));
		
		for (ProductVariant v : product.getVariants()) {
		    if (v.getVariantId().equals(vid)) {
		        mapper.map(var, v);
		        productRepo.save(product);
		        return new ApiResponse("Success", "Variant updated successfully!");
		    }
		}

		throw new ResourceNotFoundException("Variant not found");
	}
	
	private List<ProductSummaryResponse> toProductSummaryList(List<Product> products) {

	    List<ProductSummaryResponse> resp = new ArrayList<>();

	    for (Product prod : products) {

	        ProductSummaryResponse proSum = mapper.map(prod, ProductSummaryResponse.class);
	        
	        CategoryResponse category = catService.getCategoryById(prod.getSubCategoryId());
	        proSum.setCategoryName(category.getName());
	        
		    SubCategoryResponse subCategory = subCatService.getSubCategoryById(prod.getSubCategoryId());
		    proSum.setSubCategoryName(subCategory.getName());

		    BrandResponse brand = brandService.getBrandById(prod.getBrandId());
		    proSum.setBrandName(brand.getName());
		    
	        resp.add(proSum);
	    }

	    return resp;
	}

	@Override
	public List<ProductSummaryResponse> getProductsByCategory(String catId) {
		
		List<Product> products = productRepo
	            .findAllByStatusAndCategoryId(ProductStatus.APPROVED, catId);
	
		return toProductSummaryList(products);
	}

	@Override
	public List<ProductSummaryResponse> getProductsByBrand(String brandId) {
		List<Product> products = productRepo
	            .findAllByStatusAndBrandId(ProductStatus.APPROVED, brandId);
	
		return toProductSummaryList(products);
	}

	@Override
	public List<ProductSummaryResponse> getProductsBySubCat(String subCatId) {
		
		List<Product> products = productRepo
	            .findAllByStatusAndSubCategoryId(ProductStatus.APPROVED, subCatId);
	
		return toProductSummaryList(products);
	}

}
