package com.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.backend.dtos.dashboard.BrandsStatsResponse;
import com.backend.dtos.dashboard.ProductStatsResponse;
import com.backend.dtos.request.ProductAddRequest;
import com.backend.dtos.request.ProductUpdateRequest;
import com.backend.dtos.request.ProductVariantRequest;
import com.backend.dtos.response.ApiResponse;
import com.backend.dtos.response.PendingProductResponse;
import com.backend.dtos.response.ProductResponse;
import com.backend.dtos.response.ProductSummaryResponse;
import com.backend.entites.mongo.ProductStatus;

import jakarta.validation.Valid;

public interface ProductService {

	ApiResponse addProduct(Long retailerId, ProductAddRequest prod);

	List<PendingProductResponse> getAllPending();

	ApiResponse addVariant(String productId, @Valid ProductVariantRequest prodVarReq);

	List<ProductSummaryResponse> getViewProducts();

	ProductResponse getProduct(String id);

	ApiResponse deleteProductVariant(String pid, String vid);

	ApiResponse updateProduct(String id, ProductUpdateRequest prod);

	ApiResponse updateProductVariant(String pid, String vid, ProductVariantRequest var);

	List<ProductSummaryResponse> getProductsByCategory(String catId);

	List<ProductSummaryResponse> getProductsByBrand(String brandId);

	List<ProductSummaryResponse> getProductsBySubCat(String subCatId);
	
	ProductStatsResponse getProductStats();

	ApiResponse restoreProductVariant(String pid, String vid);

	void updatePricingCache(String productId, String variantId, double lowestPrice, Long long1);

	ApiResponse updateProductStatus(String id, ProductStatus status, String productCode, String reason, Long userId);
	
	public void validateProductIsApprovedForRetailer(String productId, Long retailerId);

	List<ProductSummaryResponse> getProducts(ProductStatus status);

	//List<ProductSummaryResponse> getRetailerProducts(Long retailerId, ProductStatus status);
	
	String getSkuByProductAndVariant(String pid, String vid);

	Page<ProductSummaryResponse> getProductsPage(Long retailerId, String categoryId, String subCategoryId, String brandId,
			ProductStatus status, Pageable pageable);

	ProductStatsResponse getProductStatsForRetailer(Long retailerId);
}
