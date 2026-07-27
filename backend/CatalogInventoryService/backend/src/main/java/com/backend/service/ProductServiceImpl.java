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
import com.backend.dtos.response.PendingProductResponse;
import com.backend.dtos.response.ProductResponse;
import com.backend.dtos.response.ProductSummaryResponse;
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
	private final CategoryRepository categoryRepo;
	private final SubCategoryRepository subCatRepo;
	private final BrandRepository brandRepo;
	private final ModelMapper mapper;

	@Override
	public ApiResponse addProduct(ProductAddRequest prod) {
		
		// Category, Brand, SubCategory Validation
		if (!categoryRepo.existsById(prod.getCategoryId())) {
			throw new ResourceNotFoundException("Category Not Found!!");
		}
		
		if (!subCatRepo.existsById(prod.getSubCategoryId())) {
			throw new ResourceNotFoundException("SubCategory Not Found!!");
		}
		
		if (!brandRepo.existsById(prod.getBrandId())) {
			throw new ResourceNotFoundException("Brand Not Found!!");
		}
		
		// Mapping Product
		Product product = mapper.map(prod, Product.class);

		product.setStatus(ProductStatus.PENDING);
		
		product.setCreatedByRetailerId("tempRetailer");

		product.setCreatedAt(LocalDateTime.now());

		product.setUpdatedAt(LocalDateTime.now());
		
		// Setting up product variants 
		for (ProductVariant variant : product.getVariants()) {

	        variant.setVariantId(UUID.randomUUID().toString());
	        variant.setActive(true);
	        
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
			
			Brand brand = brandRepo.findById(prod.getBrandId())
		            .orElseThrow(() ->
		                    new ResourceNotFoundException("Brand Not Found!!"));
			dto.setBrandName(brand.getName());
			
			SubCategory subCategory = subCatRepo.findById(prod.getSubCategoryId())
		            .orElseThrow(() ->
		                    new ResourceNotFoundException("SubCategory Not Found!!"));
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
			
			Brand brand = brandRepo.findById(product.getBrandId())
					.orElseThrow(() ->
						new ResourceNotFoundException("Brand Not Found!!"));
			
			String sku = brand.getCode() + "-"
	                + productCode + "-"
	                + String.format("%03d", sequence++);
			
			variant.setSku(sku);
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

		Brand brand = brandRepo.findById(product.getBrandId())
		        .orElseThrow(() ->
				new ResourceNotFoundException("Brand Not Found!!"));

		int sequence = product.getNextSku();

		ProductVariant variant = mapper.map(prodVarReq, ProductVariant.class);

		variant.setVariantId(UUID.randomUUID().toString());

		String sku = brand.getCode() + "-"
                + product.getProductCode() + "-"
                + String.format("%03d", sequence++);
		
		variant.setSku(sku);

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
		
		ProductResponse resp = mapper.map(prod, ProductResponse.class);

	    Category category = categoryRepo.findById(prod.getCategoryId())
	            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
	    resp.setCategoryName(category.getName());

	    SubCategory subCategory = subCatRepo.findById(prod.getSubCategoryId())
	            .orElseThrow(() -> new ResourceNotFoundException("SubCategory not found"));
	    resp.setSubCategoryName(subCategory.getName());

	    Brand brand = brandRepo.findById(prod.getBrandId())
	            .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
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

	        SubCategory subCategory = subCatRepo.findById(prod.getSubCategoryId())
	                .orElseThrow(() -> new ResourceNotFoundException("SubCategory not found"));

	        Brand brand = brandRepo.findById(prod.getBrandId())
	                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));

	        proSum.setSubCategoryName(subCategory.getName());
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
