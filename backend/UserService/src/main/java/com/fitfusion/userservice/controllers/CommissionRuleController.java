package com.fitfusion.userservice.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fitfusion.userservice.dtos.ApiResponse;
import com.fitfusion.userservice.dtos.CommissionRuleRequestDto;
import com.fitfusion.userservice.dtos.CommissionRuleResponseDto;
import com.fitfusion.userservice.services.CommissionRuleService;

import lombok.RequiredArgsConstructor;

/**
 * Admin-only. Locked down in SecurityConfig via
 * requestMatchers("/api/commission-rules/**").hasRole("ADMIN").
 */
@RestController
@RequestMapping("/api/commission-rules")
@RequiredArgsConstructor
public class CommissionRuleController {

    private final CommissionRuleService commissionRuleService;

    @PostMapping
    public ResponseEntity<ApiResponse> createRule(@RequestBody CommissionRuleRequestDto req) {
        return new ResponseEntity<>(commissionRuleService.createRule(req), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CommissionRuleResponseDto>> getAllRules() {
        return ResponseEntity.ok(commissionRuleService.getAllRules());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<CommissionRuleResponseDto> getRuleByCategory(@PathVariable String categoryId) {
        return ResponseEntity.ok(commissionRuleService.getRuleByCategory(categoryId));
    }

    @PutMapping("/{ruleId}")
    public ResponseEntity<ApiResponse> updateRule(
            @PathVariable Long ruleId,
            @RequestBody CommissionRuleRequestDto req) {

        return ResponseEntity.ok(commissionRuleService.updateRule(ruleId, req));
    }

    // Soft delete - doesn't actually remove the row. categoryId is required
    // as a query param so ruleId + categoryId together confirm which rule is
    // being deactivated (a category can have several old inactive rules).
    @DeleteMapping("/{ruleId}")
    public ResponseEntity<ApiResponse> deactivateRule(
            @PathVariable Long ruleId,
            @RequestParam String categoryId) {

        return ResponseEntity.ok(commissionRuleService.deactivateRule(ruleId, categoryId));
    }

    // Re-activates a previously deactivated rule.
    // Activating this rule automatically deactivates whatever is currently
    // active for the same category.
    @PatchMapping("/{ruleId}/activate")
    public ResponseEntity<ApiResponse> activateRule(
            @PathVariable Long ruleId,
            @RequestParam String categoryId) {

        return ResponseEntity.ok(commissionRuleService.activateRule(ruleId, categoryId));
    }
}
