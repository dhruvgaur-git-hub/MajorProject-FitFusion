package com.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custom_exceptions.ResourceAlreadyExistsException;
import com.backend.custom_exceptions.ResourceNotFoundException;
import com.backend.dtos.dashboard.ProductStatsResponse;
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
import com.backend.entites.mongo.Product;
import com.backend.entites.mongo.ProductStatus;
import com.backend.entites.mongo.ProductVariant;
import com.backend.repository.ProductRepository;
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
	public ApiResponse addProduct(Long retailerId, ProductAddRequest prod) {

	    log.info("Creating new product");

	    if (prod.getName() != null && productRepo.existsByName(prod.getName())) {
	    	return new ApiResponse("FAILURE", "Product with name '" + prod.getName() + "' already exists!");
	    }
	    
	    // Category, Brand, SubCategory Validation
	    catService.validateCategory(prod.getCategoryId());
	    subCatService.validateSubCat(prod.getSubCategoryId());
	    brandService.validateBrand(prod.getBrandId());

	    // Mapping Product
	    Product product = mapper.map(prod, Product.class);

	    product.setStatus(ProductStatus.PENDING);

	    product.setCreatedByRetailerId(retailerId);

	    product.setCreatedAt(LocalDateTime.now());

	    product.setUpdatedAt(LocalDateTime.now());

	    // Setting up product variants
	    for (ProductVariant variant : product.getVariants()) {

	        variant.setVariantId(UUID.randomUUID().toString());
	        variant.setActive(false);

	    }

	    productRepo.save(product);

	    log.info("Product created successfully with id {}", product.getId());

	    return new ApiResponse("SUCCESS", "Product added successfully");
	}

	@Override
	public List<PendingProductResponse> getAllPending() {

	    log.info("Fetching all pending products");

	    List<Product> prods = productRepo.findAllByStatus(ProductStatus.PENDING);

	    List<PendingProductResponse> dtoResp = new ArrayList<>();

	    for (Product prod : prods) {

	        PendingProductResponse dto = mapper.map(prod, PendingProductResponse.class);

	        BrandResponse brand = brandService.getBrandById(prod.getBrandId());
	        dto.setBrandName(brand.getName());

	        SubCategoryResponse subCategory = subCatService.getSubCategoryById(prod.getSubCategoryId());
	        dto.setSubCategoryName(subCategory.getName());

	        dto.setRetailerName("tempRetailerName");

	        dtoResp.add(dto);
	    }

	    log.info("Successfully fetched {} pending products", dtoResp.size());

	    return dtoResp;
	}
	
	@Override
	public ApiResponse addVariant(String productId, @Valid ProductVariantRequest prodVarReq) {

	    log.info("Adding variant to product {}", productId);

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

	    log.info("Variant added successfully to product {}", productId);

	    return new ApiResponse("SUCCESS", "Product Variant Added Successfully");
	}

	@Override
	public List<ProductSummaryResponse> getViewProducts() {

	    log.info("Fetching approved products for catalog");

	    List<Product> products = productRepo
	            .findAllByStatus(ProductStatus.APPROVED);

	    log.info("Successfully fetched {} approved products", products.size());

	    return toProductSummaryList(products);
	}

	@Override
	public ProductResponse getProduct(String id) {

	    log.info("Fetching product with id {}", id);

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

	    CategoryResponse category = catService.getCategoryById(prod.getCategoryId());
	    resp.setCategoryName(category.getName());

	    SubCategoryResponse subCategory = subCatService.getSubCategoryById(prod.getSubCategoryId());
	    resp.setSubCategoryName(subCategory.getName());

	    BrandResponse brand = brandService.getBrandById(prod.getBrandId());
	    resp.setBrandName(brand.getName());

	    log.info("Product {} fetched successfully", id);

	    return resp;
	}
	
	@Override
	public ApiResponse updateProductStatus(String id, ProductStatus status, String productCode, String reason, Long adminId) {
	    log.info("Updating product {} status to {}", id, status);

	    Product product = productRepo.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

	    switch (status) {
	        case APPROVED:
	            if (productCode == null || productCode.isBlank()) {
	                throw new IllegalArgumentException("Product code is required for approval!");
	            }
	            if (productRepo.existsByProductCode(productCode)) {
	                throw new ResourceAlreadyExistsException("ProductCode must be unique!");
	            }

	            product.setApprovedAt(LocalDateTime.now());
	            product.setApprovedByAdminId(adminId);
	            product.setProductCode(productCode);

	            // Auto-generate SKUs and activate initial variants
	            int sequence = 1;
	            BrandResponse brand = brandService.getBrandById(product.getBrandId());
	            if (product.getVariants() != null) {
	                for (ProductVariant variant : product.getVariants()) {
	                    String sku = String.format("%s-%s-%03d", brand.getCode(), productCode, sequence++);
	                    variant.setSku(sku);
	                    variant.setActive(true);
	                }
	            }
	            product.setNextSku(sequence);
	            break;

	        case REJECTED:
	            product.setRejectionReason(reason);
	            break;

	        case DISABLED: // Soft delete
	            if (product.getVariants() != null) {
	                for (ProductVariant variant : product.getVariants()) {
	                    variant.setActive(false);
	                }
	            }
	            break;

	        case PENDING:
	            break;

	        default:
	            throw new IllegalArgumentException("Invalid Product Status: " + status);
	    }

	    product.setStatus(status);
	    product.setUpdatedAt(LocalDateTime.now());
	    productRepo.save(product);

	    log.info("Product {} status successfully updated to {}", id, status);
	    return new ApiResponse("SUCCESS", "Product status updated to " + status);
	}

	@Override
	public ApiResponse deleteProductVariant(String pid, String vid) {

	    log.info("Deleting variant {} from product {}", vid, pid);

	    Product prod = productRepo.findById(pid)
	            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

	    for (ProductVariant variant : prod.getVariants()) {
	        if (variant.getVariantId().equals(vid)) {
	            variant.setActive(false);
	        }
	    }

	    productRepo.save(prod);

	    log.info("Variant {} deleted successfully from product {}", vid, pid);

	    return new ApiResponse("Success", "Product Variant Deleted!!");
	}
	
	@Override
	public ApiResponse restoreProductVariant(String pid, String vid) {

	    log.info("Restoring variant {} of product {}", vid, pid);

	    Product product = productRepo.findById(pid)
	            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

	    for (ProductVariant variant : product.getVariants()) {
	        if (variant.getVariantId().equals(vid)) {

	            variant.setActive(true);

	            productRepo.save(product);

	            log.info("Variant {} restored successfully", vid);

	            return new ApiResponse("Success", "Product Variant Restored Successfully!!");
	        }
	    }

	    throw new ResourceNotFoundException("Variant not found");
	}
	
	@Override
	public ApiResponse updateProduct(String id, ProductUpdateRequest prod) {

	    log.info("Updating product with id {}", id);

	    Product product = productRepo.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

	    mapper.map(prod, product);

	    productRepo.save(product);

	    log.info("Product {} updated successfully", id);

	    return new ApiResponse("Success", "Product updated Successfully!!");
	}

	@Override
	public ApiResponse updateProductVariant(String pid, String vid, ProductVariantRequest var) {

	    log.info("Updating variant {} of product {}", vid, pid);

	    Product product = productRepo.findById(pid)
	            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

	    for (ProductVariant v : product.getVariants()) {
	        if (v.getVariantId().equals(vid)) {
	            mapper.map(var, v);
	            productRepo.save(product);

	            log.info("Variant {} updated successfully", vid);

	            return new ApiResponse("Success", "Variant updated successfully!");
	        }
	    }

	    throw new ResourceNotFoundException("Variant not found");
	}
	
	private ProductSummaryResponse toProductSummary(Product prod) {
	    ProductSummaryResponse proSum = mapper.map(prod, ProductSummaryResponse.class);

	    proSum.setStartingPrice(prod.getStartingPrice());

	    CategoryResponse category = catService.getCategoryById(prod.getCategoryId());
	    proSum.setCategoryName(category.getName());

	    SubCategoryResponse subCategory = subCatService.getSubCategoryById(prod.getSubCategoryId());
	    proSum.setSubCategoryName(subCategory.getName());

	    BrandResponse brand = brandService.getBrandById(prod.getBrandId());
	    proSum.setBrandName(brand.getName());

	    return proSum;
	}

	private List<ProductSummaryResponse> toProductSummaryList(List<Product> products) {

	    List<ProductSummaryResponse> resp = new ArrayList<>();

	    for (Product prod : products) {
	        resp.add(toProductSummary(prod));
	    }

	    return resp;
	}

	@Override
	public List<ProductSummaryResponse> getProductsByCategory(String catId) {

	    log.info("Fetching products by category {}", catId);

	    List<Product> products = productRepo
	            .findAllByStatusAndCategoryId(ProductStatus.APPROVED, catId);

	    log.info("Found {} products for category {}", products.size(), catId);

	    return toProductSummaryList(products);
	}

	@Override
	public List<ProductSummaryResponse> getProductsByBrand(String brandId) {

	    log.info("Fetching products by brand {}", brandId);

	    List<Product> products = productRepo
	            .findAllByStatusAndBrandId(ProductStatus.APPROVED, brandId);

	    log.info("Found {} products for brand {}", products.size(), brandId);

	    return toProductSummaryList(products);
	}

	@Override
	public List<ProductSummaryResponse> getProductsBySubCat(String subCatId) {

	    log.info("Fetching products by subcategory {}", subCatId);

	    List<Product> products = productRepo
	            .findAllByStatusAndSubCategoryId(ProductStatus.APPROVED, subCatId);

	    log.info("Found {} products for subcategory {}", products.size(), subCatId);

	    return toProductSummaryList(products);
	}

	@Override
	public ProductStatsResponse getProductStats() {

	    log.info("Fetching product statistics");

	    long total = productRepo.count();
	    long approved = productRepo.countByStatus(ProductStatus.APPROVED);

	    log.info("Product statistics calculated successfully");

	    return ProductStatsResponse.builder()
	            .total(total)
	            .active(approved)
	            .inactive(total - approved)
	            .build();
	}

	@Override
	public void updatePricingCache(String productId, String variantId, double lowestPrice, Long retailerId) {
	    
	    Product product = productRepo.findById(productId)
	            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

	    boolean variantFound = false;
	    if (product.getVariants() != null) {
	        for (ProductVariant v : product.getVariants()) {
	            if (v.getVariantId().equals(variantId)) {
	                v.setLowestPrice(lowestPrice);
	                v.setCheapestRetailerId(retailerId);
	                variantFound = true;
	                break;
	            }
	        }
	    }

	    if (!variantFound) {
	        log.info("Variant pricing cache failed to update for variant {}", variantId);
	        throw new ResourceNotFoundException("Variant not found");
	    }

	    double startingPrice = Double.MAX_VALUE;
	    for (ProductVariant v : product.getVariants()) {
	        if (v.getLowestPrice() != null && v.getLowestPrice() < startingPrice) {
	            startingPrice = v.getLowestPrice();
	        }
	    }
	    
	    if (startingPrice != Double.MAX_VALUE) {
	        product.setStartingPrice(startingPrice);
	    }

	    productRepo.save(product);
	    log.info("Variant pricing cache and starting price updated successfully for variant {}", variantId);
	}

	@Override
	@Transactional(readOnly = true)
	public List<ProductSummaryResponse> getProducts(ProductStatus status) {
	    
	    log.info("Fetching products with status filter: {}", status);

	    List<Product> products;
	    if (status != null) {
	        products = productRepo.findAllByStatus(status);
	    } else {
	        products = productRepo.findAll(); // Returns all if no status filter is selected
	    }

	    return toProductSummaryList(products);
	}
	
	@Override
	public void validateProductIsApprovedForRetailer(String productId, Long retailerId) {
	    Product product = productRepo.findById(productId)
	            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

//	    // Check ownership
//	    if (!product.getCreatedByRetailerId().equals(retailerId)) {
//	        throw new AccessDeniedException("You are not authorized to add inventory for a product you did not create.");
//	    }

	    // Check if product is approved
	    if (product.getStatus() != ProductStatus.APPROVED) {
	        throw new IllegalStateException("Inventory can only be added for APPROVED products. Current product status is: " + product.getStatus());
	    }
	}

//	@Override
//	@Transactional(readOnly = true)
//	public List<ProductSummaryResponse> getRetailerProducts(Long retailerId, ProductStatus status) {
//	    log.info("Fetching products for retailer {} with status filter: {}", retailerId, status);
//
//	    List<Product> products;
//	    if (status != null) {
//	        products = productRepo.findByCreatedByRetailerIdAndStatus(retailerId, status);
//	    } else {
//	        products = productRepo.findByCreatedByRetailerId(retailerId);
//	    }
//
//	    return toProductSummaryList(products);
//	}

	@Override
	public String getSkuByProductAndVariant(String pid, String vid) {
		
		 Product product = productRepo.findById(pid)
		            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + pid));
		 
		 if (product.getVariants() != null) {
		        for (ProductVariant v : product.getVariants()) {
		            if (v.getVariantId().equals(vid)) {
		               return v.getSku();
		            }
		        }
		    }
		 return "";
	}

	@Override
	public Page<ProductSummaryResponse> getProductsPage(Long retailerId, String categoryId, String subCategoryId, String brandId,
			ProductStatus status, Pageable pageable) {
		
			Page<Product> productPage = productRepo.findProductsDynamic(retailerId, categoryId, subCategoryId, brandId, status, pageable);
			
			return productPage.map(this::toProductSummary); 
	}

	@Override
	public ProductStatsResponse getProductStatsForRetailer(Long retailerId) {
	    log.info("Fetching product statistics for retailer ID: {}", retailerId);

	    long total = productRepo.countByCreatedByRetailerId(retailerId);
	    long approved = productRepo.countByCreatedByRetailerIdAndStatus(retailerId, ProductStatus.APPROVED);
	    long pending = productRepo.countByCreatedByRetailerIdAndStatus(retailerId, ProductStatus.PENDING);
	    long rejected = productRepo.countByCreatedByRetailerIdAndStatus(retailerId, ProductStatus.REJECTED);

	    log.info("Product statistics calculated successfully for retailer ID: {}", retailerId);

	    return ProductStatsResponse.builder()
	            .total(total)
	            .approved(approved)
	            .pending(pending)
	            .rejected(rejected)
	            .build();
	}

	@Override
	public String getCategoryIdByProductId(String productId) {
	    // 1. Find the product by ID using your product repository, or throw an exception if missing
	    Product product = productRepo.findById(productId)
	            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

	    // 2. Return the categoryId field from the product entity
	    return product.getCategoryId();
	}
}
