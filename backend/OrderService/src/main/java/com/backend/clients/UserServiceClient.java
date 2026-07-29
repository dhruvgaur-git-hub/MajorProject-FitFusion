package com.backend.clients;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.backend.custom_exceptions.InvalidOperationException;
import com.backend.dtos.external.CommissionRuleResponseDto;
import com.backend.dtos.external.DiscountRuleResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserServiceClient {

	private final RestTemplate restTemplate;

	@Value("${service.user.base-url}")
	private String userServiceBaseUrl;

	public CommissionRuleResponseDto getCommissionRule(String categoryId) {
		try {
			String url = userServiceBaseUrl + "/api/commission-rules/category/" + categoryId;
			return restTemplate.getForObject(url, CommissionRuleResponseDto.class);
		}
		catch (RestClientException e) {
			log.error("Failed to fetch commission rule for categoryId {}: {}", categoryId, e.getMessage());
			throw new InvalidOperationException("Unable to fetch commission rule. User Service may be unavailable.");
		}
	}

	public DiscountRuleResponseDto getDiscountRule(String categoryId) {
		try {
			String url = userServiceBaseUrl + "/api/discount-rules/category/" + categoryId;
			return restTemplate.getForObject(url, DiscountRuleResponseDto.class);
		}
		catch (RestClientException e) {
			log.error("Failed to fetch discount rule for categoryId {}: {}", categoryId, e.getMessage());
			throw new InvalidOperationException("Unable to fetch discount rule. User Service may be unavailable.");
		}
	}
}