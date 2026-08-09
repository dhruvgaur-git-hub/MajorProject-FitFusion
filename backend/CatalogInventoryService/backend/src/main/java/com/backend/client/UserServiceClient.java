package com.backend.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.backend.dtos.response.CommissionRuleResponseDto;
import com.backend.dtos.response.DiscountRuleResponseDto;

//The 'url' property points directly to the User Service port
@FeignClient(name = "user-service", url = "http://localhost:9091")
public interface UserServiceClient {

	 @GetMapping("/api/commission-rules/category/{categoryId}")
	 CommissionRuleResponseDto getCommissionRule(@PathVariable("categoryId") String categoryId);
	
	 @GetMapping("/api/discount-rules/category/{categoryId}")
	 DiscountRuleResponseDto getDiscountRule(@PathVariable("categoryId") String categoryId);
}
