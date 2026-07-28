package com.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.dtos.request.InventoryRequest;
import com.backend.dtos.response.ApiResponse;
import com.backend.entites.mongo.Inventory;
import com.backend.repository.InventoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {
	
	private final ProductService productService;
	private final InventoryRepository inventoryRepo;
	private final ModelMapper mapper;
	
	@Override
	public ApiResponse addInventory(InventoryRequest request) {
		
		if(inventoryRepo.existsByVariantIdAndRetailerId(request.getVariantId(), request.getRetailerId())) {
			throw new IllegalArgumentException("Inventory record already exists for this retailer and variant. Use update route instead."); 
		}
		
		Inventory inventory = mapper.map(request, Inventory.class);
        inventory.setReservedQuantity(0); 
        inventory.setActive(true);
        inventory.setUpdatedAt(LocalDateTime.now());
		
        inventoryRepo.save(inventory);
        
        recalculateCheapestPrice(inventory.getProductId(), inventory.getVariantId());
        
        return new ApiResponse("SUCCESS", "Inventory added successfully");
        
	}
	
	private void recalculateCheapestPrice(String productId, String variantId) {
		
	    List<Inventory> activeInventories = inventoryRepo.findByVariantIdAndActiveTrue(variantId);
	    
	    if (activeInventories.isEmpty()) {
	        return;
	    }

	    Inventory cheapest = activeInventories.get(0);
	    double lowestPrice = calculateSellingPrice(cheapest.getRetailerQuotedPrice());

	    for (Inventory inv : activeInventories) {
	        double price = calculateSellingPrice(inv.getRetailerQuotedPrice());
	        if (price < lowestPrice) {
	            lowestPrice = price;
	            cheapest = inv;
	        }
	    }

	    productService.updatePricingCache(productId, variantId, lowestPrice, cheapest.getRetailerId());
	}

	private double calculateSellingPrice(double retailerQuotedPrice) {
	    double commissionPercent = 10.0;
	    double discountPercent = 5.0;
	    double platformPrice = retailerQuotedPrice * (1 + (commissionPercent / 100.0));
	    return platformPrice * (1 - (discountPercent / 100.0));
	}

}
