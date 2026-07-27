package com.backend.service;

import java.util.List;
import java.util.Optional;

import com.backend.dtos.dashboard.BrandsStatsResponse;
import com.backend.dtos.dashboard.ProductStatsResponse;
import com.backend.dtos.request.ProductAddRequest;
import com.backend.dtos.request.ProductUpdateRequest;
import com.backend.dtos.request.ProductVariantRequest;
import com.backend.dtos.response.ApiResponse;
import com.backend.dtos.response.PendingProductResponse;
import com.backend.dtos.response.ProductResponse;
import com.backend.dtos.response.ProductSummaryResponse;

import jakarta.validation.Valid;

public interface ProductService {

	ApiResponse addProduct(ProductAddRequest prod);

	List<PendingProductResponse> getAllPending();

	ApiResponse approveProduct(String id, String productCode);

	ApiResponse addVariant(String productId, @Valid ProductVariantRequest prodVarReq);

	List<ProductSummaryResponse> getViewProducts();

	ProductResponse getProduct(String id);

	ApiResponse rejectProduct(String id, String reason);

	ApiResponse deleteProduct(String id);

	ApiResponse deleteProductVariant(String pid, String vid);

	ApiResponse updateProduct(String id, ProductUpdateRequest prod);

	ApiResponse updateProductVariant(String pid, String vid, ProductVariantRequest var);

	List<ProductSummaryResponse> getProductsByCategory(String catId);

	List<ProductSummaryResponse> getProductsByBrand(String brandId);

	List<ProductSummaryResponse> getProductsBySubCat(String subCatId);
	
	ProductStatsResponse getProductStats();
}
