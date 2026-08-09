package com.fitfusion.userservice.services;

import java.util.List;

import com.fitfusion.userservice.dtos.ApiResponse;
import com.fitfusion.userservice.dtos.CommissionRuleRequestDto;
import com.fitfusion.userservice.dtos.CommissionRuleResponseDto;

public interface CommissionRuleService {

    // POST /api/commission-rules - creates a new rule for a category. A
    // category can already have an active rule from before - this doesn't
    // get rejected, it supersedes it: the old active row is deactivated
    // (kept around as history) and the new one becomes the active rule.
    // That's how a category ends up with several rows over time, all
    // sharing the same categoryId, with only one ever active at once.
    ApiResponse createRule(CommissionRuleRequestDto req);

    // GET /api/commission-rules - returns all rules, active and inactive. Admins can see the whole history of rules, not just the current ones.
    List<CommissionRuleResponseDto> getAllRules();

    // GET /api/commission-rules/category/{categoryId} - returns the active rule for a given category,
    // or throws ResourceNotFoundException if none exists.
    CommissionRuleResponseDto getRuleByCategory(String categoryId);

    // PUT /api/commission-rules/{ruleId} - updates an existing rule. Only the commissionPercent can be updated; categoryId is immutable.
    ApiResponse updateRule(Long ruleId, CommissionRuleRequestDto req);

    // DELETE /api/commission-rules/{ruleId} - soft delete: flips active to
    // false rather than removing the row, so past orders that referenced
    // this rule still have something to point to.
    ApiResponse deactivateRule(Long ruleId, String categoryId);

    // PATCH /api/commission-rules/{ruleId}/activate - re-activates a
    // previously deactivated (superseded/old) rule.
    ApiResponse activateRule(Long ruleId, String categoryId);
}
