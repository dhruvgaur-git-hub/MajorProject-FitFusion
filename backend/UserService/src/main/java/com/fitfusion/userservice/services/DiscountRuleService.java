package com.fitfusion.userservice.services;

import java.util.List;

import com.fitfusion.userservice.dtos.ApiResponse;
import com.fitfusion.userservice.dtos.DiscountRuleRequestDto;
import com.fitfusion.userservice.dtos.DiscountRuleResponseDto;

public interface DiscountRuleService {

    // POST /api/discount-rules - creates a new rule for a category. A
    // category can already have an active rule from before - this doesn't
    // get rejected, it supersedes it: the old active row is deactivated
    // (kept around as history) and the new one becomes the active rule.
    // That's how a category ends up with several rows over time, all
    // sharing the same categoryId, with only one ever active at once.
    ApiResponse createRule(DiscountRuleRequestDto req);

    // GET /api/discount-rules - returns all rules, active and inactive. Admins can see the whole history of rules, not just the current ones.
    List<DiscountRuleResponseDto> getAllRules();

    // GET /api/discount-rules/category/{categoryId} - returns the active rule for a given category, or throws ResourceNotFoundException if none exists.
    DiscountRuleResponseDto getRuleByCategory(String categoryId);

    // PUT /api/discount-rules/{ruleId} - updates an existing rule.
    // Only the discountPercent can be updated; categoryId is immutable.
    ApiResponse updateRule(Long ruleId, DiscountRuleRequestDto req);

    // Soft delete - flips active to false, doesn't remove the row.
    ApiResponse deactivateRule(Long ruleId, String categoryId);

    // PATCH /api/discount-rules/{ruleId}/activate - re-activates a
    // previously deactivated (superseded/old) rule.
    ApiResponse activateRule(Long ruleId, String categoryId);
}
