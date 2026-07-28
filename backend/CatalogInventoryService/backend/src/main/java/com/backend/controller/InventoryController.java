package com.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dtos.request.InventoryRequest;
import com.backend.dtos.request.InventoryUpdateRequest;
import com.backend.security.JwtUser;
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
	
//	@PostMapping("/addinventory")
//    public ResponseEntity<?> addInventory(@AuthenticationPrincipal JwtUser user, @RequestBody @Valid InventoryRequest request) {
//        
//		Long retailerId = user.getUserId();
//		
//		log.info("Received request to add inventory for variant {} by retailer {}", 
//                request.getVariantId(), retailerId);
//        
//        return ResponseEntity.status(HttpStatus.CREATED)
//                .body(inventoryService.addInventory(retailerId, request));
//    }
	
	@PostMapping("/addinventory")
    public ResponseEntity<?> addInventory(@RequestBody @Valid InventoryRequest request) {
        
		Long retailerId = 123L;
		
		log.info("Received request to add inventory for variant {} by retailer {}", 
                request.getVariantId(), retailerId);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(inventoryService.addInventory(retailerId, request));
    }
	
	@PutMapping("/{id}")
	public ResponseEntity<?> updateInventory(@PathVariable String id, @RequestBody @Valid InventoryUpdateRequest request) {
	    return ResponseEntity.ok(inventoryService.updateInventory(id, request));
	}
	
//	@GetMapping("/retailer")
//    public ResponseEntity<?> getRetailerInventory(@AuthenticationPrincipal JwtUser user) {
//        
//        Long retailerId = user.getUserId();
//        
//        return ResponseEntity.ok(inventoryService.getInventoryByRetailerId(retailerId));
//    }
	
	@GetMapping("/retailer")
    public ResponseEntity<?> getRetailerInventory() {
        
        Long retailerId = 123L;
        
        return ResponseEntity.ok(inventoryService.getInventoryByRetailerId(retailerId));
    }
}
