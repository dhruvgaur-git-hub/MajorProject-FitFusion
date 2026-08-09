package com.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.client.UserServiceClient;
import com.backend.custom_exceptions.ResourceNotFoundException;
import com.backend.dtos.request.InventoryRequest;
import com.backend.dtos.request.InventoryUpdateRequest;
import com.backend.dtos.response.ApiResponse;
import com.backend.dtos.response.CommissionRuleResponseDto;
import com.backend.dtos.response.DiscountRuleResponseDto;
import com.backend.dtos.response.InventoryResponse;
import com.backend.entites.mongo.Inventory;
import com.backend.repository.InventoryRepository;

import jakarta.validation.Valid;
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
	
	// FeignClient 
	private final UserServiceClient userServiceClient;
	
	@Override
	public ApiResponse addInventory(Long retailerId, InventoryRequest request) {
		
		// 1. Validate Product
		productService.validateProductIsApprovedForRetailer(request.getProductId(), retailerId);

		// 2. Check if inventory record already exists for this variant and retailer
		if(inventoryRepo.existsByVariantIdAndRetailerId(request.getVariantId(), retailerId)) {
			throw new IllegalArgumentException("Inventory record already exists for this retailer and variant."); 
		}
		
		Inventory inventory = mapper.map(request, Inventory.class);
		inventory.setRetailerId(retailerId);
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
		double lowestPrice = calculateSellingPrice(productId, cheapest.getRetailerQuotedPrice());

		for (Inventory inv : activeInventories) {
			double price = calculateSellingPrice(productId, inv.getRetailerQuotedPrice());
			if (price < lowestPrice) {
				lowestPrice = price;
				cheapest = inv;
			}
		}

		productService.updatePricingCache(productId, variantId, lowestPrice, cheapest.getRetailerId());
	}

	private double calculateSellingPrice(String productId, double retailerQuotedPrice) {
		double commissionPercent = 10.0; // Fallback default
		double discountPercent = 5.0;  // Fallback default
		String categoryId = null;

		try {
			// Step 1: Fetch the categoryId
			categoryId = productService.getCategoryIdByProductId(productId);
			if (categoryId == null) {
				log.warn("Pinpoint Error: Category ID returned null for productId: {}", productId);
				return computePrice(retailerQuotedPrice, commissionPercent, discountPercent);
			}

			// Step 2: Fetch Commission Rule
			try {
				CommissionRuleResponseDto commissionRule = userServiceClient.getCommissionRule(categoryId);
				if (commissionRule != null && commissionRule.getCommissionPercent() != null) {
					commissionPercent = commissionRule.getCommissionPercent();
				}
			} catch (Exception e) {
				log.warn("Pinpoint Error: Failed to fetch Commission Rule for categoryId: {} (productId: {}). Reason: {}", 
						categoryId, productId, e.getMessage());
			}

			// Step 3: Fetch Discount Rule
			try {
				DiscountRuleResponseDto discountRule = userServiceClient.getDiscountRule(categoryId);
				if (discountRule != null && discountRule.getDiscountPercent() != null) {
					discountPercent = discountRule.getDiscountPercent();
				}
			} catch (Exception e) {
				log.warn("Pinpoint Error: Failed to fetch Discount Rule for categoryId: {} (productId: {}). Reason: {}", 
						categoryId, productId, e.getMessage());
			}

			log.info("Successfully processed pricing rules for productId: {} (CategoryId: {}). Commission: {}%, Discount: {}%", 
					productId, categoryId, commissionPercent, discountPercent);

		} catch (Exception e) {
			log.error("Pinpoint Error: Unexpected failure in category lookup or pricing flow for productId: {}. Error: {}", 
					productId, e.getMessage(), e);
		}

		return computePrice(retailerQuotedPrice, commissionPercent, discountPercent);
	}

	// Helper method to keep calculation DRY
	private double computePrice(double retailerQuotedPrice, double commissionPercent, double discountPercent) {
		double platformPrice = retailerQuotedPrice * (1 + (commissionPercent / 100.0));
		return platformPrice * (1 - (discountPercent / 100.0));
	}
	@Override
	public ApiResponse updateInventory(String id, @Valid InventoryUpdateRequest request) {
		
		Inventory inventory = inventoryRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Inventory record not found with id: " + id));

		inventory.setQuantity(request.getQuantity());
		inventory.setRetailerQuotedPrice(request.getRetailerQuotedPrice());    
		inventory.setUpdatedAt(LocalDateTime.now());

		inventoryRepo.save(inventory);

		recalculateCheapestPrice(inventory.getProductId(), inventory.getVariantId());

		return new ApiResponse("SUCCESS", "Inventory updated successfully");
	}
	
	@Override
	public ApiResponse reduceStock(String variantId, Long retailerId, Integer quantity) {

		List<Inventory> matches = inventoryRepo.findByRetailerIdAndVariantId(retailerId, variantId);

		if (matches.isEmpty()) {
			throw new ResourceNotFoundException(
					"No inventory record found for variant " + variantId + " / retailer " + retailerId);
		}

		Inventory inventory = matches.get(0);

		if (inventory.getQuantity() == null || inventory.getQuantity() < quantity) {
			throw new IllegalArgumentException(
					"Insufficient stock for variant " + variantId + " / retailer " + retailerId
					+ " (available: " + inventory.getQuantity() + ", requested: " + quantity + ")");
		}

		inventory.setQuantity(inventory.getQuantity() - quantity);
		inventory.setUpdatedAt(LocalDateTime.now());

		inventoryRepo.save(inventory);

		log.info("Reduced stock by {} for variant {} / retailer {}. New quantity: {}",
				quantity, variantId, retailerId, inventory.getQuantity());

		return new ApiResponse("SUCCESS", "Stock reduced successfully");
	}

	private List<InventoryResponse> mapToInventoryResponse(List<Inventory> inventories){
		
		List<InventoryResponse> responseList = new ArrayList<>();

		for (Inventory inventory : inventories) {
			InventoryResponse dto = mapper.map(inventory, InventoryResponse.class);
			String sku = productService.getSkuByProductAndVariant(inventory.getProductId(), inventory.getVariantId());
			dto.setSku(sku);
			responseList.add(dto);
		}

		return responseList;
	}

	@Override
	public List<InventoryResponse> getInventoryByRetailerId(Long retailerId) {
		
		List<Inventory> inventories = inventoryRepo.findByRetailerId(retailerId);
		
		return mapToInventoryResponse(inventories);
	}

	@Override
	public List<InventoryResponse> getRetailerVariantInventory(Long retailerId, String variantId) {
		
		List<Inventory> inventories = inventoryRepo.findByRetailerIdAndVariantId(retailerId, variantId);
		
		return mapToInventoryResponse(inventories);
	}
}