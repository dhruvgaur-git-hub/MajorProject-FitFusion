package com.backend.service;

import com.backend.dtos.request.InventoryRequest;
import com.backend.dtos.response.ApiResponse;

import jakarta.validation.Valid;

public interface InventoryService {

	ApiResponse addInventory(InventoryRequest request);

}
