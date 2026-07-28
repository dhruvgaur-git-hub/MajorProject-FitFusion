package com.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dtos.request.InventoryRequest;
import com.backend.dtos.request.InventoryUpdateRequest;
import com.backend.dtos.response.ApiResponse;
import com.backend.service.InventoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Validated
@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
public class InventoryController {
	
	private final InventoryService inventoryService;
	
	@PostMapping("/addinventory")
    public ResponseEntity<?> addInventory(@RequestBody @Valid InventoryRequest request) {
        
		log.info("Received request to add inventory for variant {} by retailer {}", 
                request.getVariantId(), request.getRetailerId());
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(inventoryService.addInventory(request));
    }
	
	@PutMapping("/{id}")
	public ResponseEntity<?> updateInventory(@PathVariable String id, @RequestBody @Valid InventoryUpdateRequest request) {
	    return ResponseEntity.ok(inventoryService.updateInventory(id, request));
	}
}
