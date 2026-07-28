package com.backend.service;

import com.backend.dtos.request.InventoryRequest;
import com.backend.dtos.request.InventoryUpdateRequest;
import com.backend.dtos.response.ApiResponse;

public interface InventoryService {

	ApiResponse addInventory(InventoryRequest request);

	ApiResponse updateInventory(String id, InventoryUpdateRequest request);

}
