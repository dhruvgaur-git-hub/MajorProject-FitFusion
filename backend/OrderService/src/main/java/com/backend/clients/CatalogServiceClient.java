package com.backend.clients;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.backend.custom_exceptions.InvalidOperationException;
import com.backend.dtos.external.InventoryResponseDto;

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
			return restTemplate.getForObject(url, InventoryResponseDto.class);
		}
		catch (RestClientException e) {
			log.error("Failed to fetch inventory for variantId {} / retailerId {}: {}",
					variantId, retailerId, e.getMessage());
			throw new InvalidOperationException("Unable to fetch inventory. Catalog Service may be unavailable.");
		}
	}
}