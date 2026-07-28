package com.fitfusion.userservice.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fitfusion.userservice.dtos.ApiResponse;
import com.fitfusion.userservice.dtos.DiscountRuleRequestDto;
import com.fitfusion.userservice.dtos.DiscountRuleResponseDto;
import com.fitfusion.userservice.services.DiscountRuleService;

import lombok.RequiredArgsConstructor;

/**
 * Admin-only. Locked down in SecurityConfig via
 * requestMatchers("/api/discount-rules/**").hasRole("ADMIN").
 */
@RestController
@RequestMapping("/api/discount-rules")
@RequiredArgsConstructor
public class DiscountRuleController {

    private final DiscountRuleService discountRuleService;

    @PostMapping
    public ResponseEntity<ApiResponse> createRule(@RequestBody DiscountRuleRequestDto req) {
        return new ResponseEntity<>(discountRuleService.createRule(req), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<DiscountRuleResponseDto>> getAllRules() {
        return ResponseEntity.ok(discountRuleService.getAllRules());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<DiscountRuleResponseDto> getRuleByCategory(@PathVariable String categoryId) {
        return ResponseEntity.ok(discountRuleService.getRuleByCategory(categoryId));
    }

    @PutMapping("/{ruleId}")
    public ResponseEntity<ApiResponse> updateRule(
            @PathVariable Long ruleId,
            @RequestBody DiscountRuleRequestDto req) {

        return ResponseEntity.ok(discountRuleService.updateRule(ruleId, req));
    }

    // Soft delete - doesn't actually remove the row. categoryId is required
    // as a query param so ruleId + categoryId together confirm which rule is
    // being deactivated (a category can have several old inactive rules).
    @DeleteMapping("/{ruleId}")
    public ResponseEntity<ApiResponse> deactivateRule(
            @PathVariable Long ruleId,
            @RequestParam String categoryId) {

        return ResponseEntity.ok(discountRuleService.deactivateRule(ruleId, categoryId));
    }
}
