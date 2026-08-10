package com.backend.clients;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.backend.custom_exceptions.InvalidOperationException;
import com.backend.dtos.external.InventoryResponseDto;
import com.backend.dtos.external.StockReduceRequestDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class CatalogServiceClient {

	private final RestTemplate restTemplate;

	@Value("${service.catalog.base-url}")
	private String catalogServiceBaseUrl;

	public InventoryResponseDto getInventory(String variantId, Long retailerId) {
		try {
			String url = catalogServiceBaseUrl
					+ "/api/inventory/variant/" + variantId
					+ "/retailer/" + retailerId;

			InventoryResponseDto[] results =
					restTemplate.getForObject(url, InventoryResponseDto[].class);

			if (results == null || results.length == 0) {
				throw new InvalidOperationException(
						"No inventory found for this variant and retailer combination.");
			}

			return results[0];
		}
		catch (RestClientException e) {
			log.error("Failed to fetch inventory for variantId {} / retailerId {}: {}",
					variantId, retailerId, e.getMessage());
			throw new InvalidOperationException("Unable to fetch inventory. Catalog Service may be unavailable.");
		}
	}

	// Called once a payment is confirmed, to deduct the purchased quantity
	// from the retailer's stock. Deliberately does NOT throw on failure —
	// the payment has already succeeded by this point, so a Catalog Service
	// outage here shouldn't roll back a confirmed payment. Failures are
	// logged loudly instead so stock can be reconciled manually if needed.
	public void reduceStock(String variantId, Long retailerId, Integer quantity) {
		try {
			String url = catalogServiceBaseUrl
					+ "/api/inventory/variant/" + variantId
					+ "/retailer/" + retailerId
					+ "/reduce";

			restTemplate.put(url, new StockReduceRequestDto(quantity));

			log.info("Stock reduced by {} for variantId {} / retailerId {}", quantity, variantId, retailerId);
		}
		catch (RestClientException e) {
			log.error("Failed to reduce stock for variantId {} / retailerId {} by {}: {}. "
					+ "Stock will need to be reconciled manually.",
					variantId, retailerId, quantity, e.getMessage());
		}
	}
}