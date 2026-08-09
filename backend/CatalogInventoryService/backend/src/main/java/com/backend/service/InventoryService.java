package com.backend.service;

import java.util.List;

import com.backend.dtos.request.InventoryRequest;
import com.backend.dtos.request.InventoryUpdateRequest;
import com.backend.dtos.response.ApiResponse;
import com.backend.dtos.response.InventoryResponse;

public interface InventoryService {

	ApiResponse addInventory(Long retailerId, InventoryRequest request);

	ApiResponse updateInventory(String id, InventoryUpdateRequest request);

	ApiResponse reduceStock(String variantId, Long retailerId, Integer quantity);

	List<InventoryResponse> getInventoryByRetailerId(Long retailerId);

	List<InventoryResponse> getRetailerVariantInventory(Long retailerId, String variantId);

}
