package com.fitfusion.userservice.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fitfusion.userservice.dtos.ApiResponse;
import com.fitfusion.userservice.dtos.CommissionRuleRequestDto;
import com.fitfusion.userservice.dtos.CommissionRuleResponseDto;
import com.fitfusion.userservice.entities.CommissionRule;
import com.fitfusion.userservice.exceptions.ResourceNotFoundException;
import com.fitfusion.userservice.repositories.CommissionRuleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CommissionRuleServiceImpl implements CommissionRuleService {

    private final CommissionRuleRepository commissionRuleRepo;
    private final ModelMapper modelMapper;

    @Override
    public ApiResponse createRule(CommissionRuleRequestDto req) {
        // If a row already exists for this exact category + percent (active
        // or not), reuse it instead of inserting a duplicate
        Optional<CommissionRule> matchingRule = commissionRuleRepo.findByCategoryIdAndCommissionPercent(
                req.getCategoryId(), req.getCommissionPercent());

        if (matchingRule.isPresent()) {
            CommissionRule rule = matchingRule.get();
            if (rule.getActive()) {
                // Already the active rule for this category with this exact
                // percent - nothing actually changed, so do nothing.
                return new ApiResponse("SUCCESS", "Commission rule already active for category " + req.getCategoryId());
            }

            // It exists but is inactive (an old, superseded version) -
            // reactivate that same row instead of creating a new one.
            deactivateCurrentActiveRule(req.getCategoryId());
            rule.setActive(true);
            commissionRuleRepo.save(rule);
            return new ApiResponse("SUCCESS", "Commission rule reactivated successfully");
        }

        //in case of new percent for this category - supersede whatever is
        //currently active and insert a new row.
        deactivateCurrentActiveRule(req.getCategoryId());

        CommissionRule rule = modelMapper.map(req, CommissionRule.class);
        rule.setActive(true);

        commissionRuleRepo.save(rule);
        return new ApiResponse("SUCCESS", "Commission rule created successfully");
    }

    private void deactivateCurrentActiveRule(String categoryId) {
        Optional<CommissionRule> existingActiveRule = commissionRuleRepo.findByCategoryIdAndActiveTrue(categoryId);
        if (existingActiveRule.isPresent()) {
            CommissionRule oldRule = existingActiveRule.get();
            oldRule.setActive(false);
            commissionRuleRepo.save(oldRule);
        }
    }

    @Override
    public List<CommissionRuleResponseDto> getAllRules() {
        List<CommissionRule> rules = commissionRuleRepo.findAll();
        List<CommissionRuleResponseDto> responseList = new ArrayList<>();

        for (CommissionRule rule : rules) {
            responseList.add(modelMapper.map(rule, CommissionRuleResponseDto.class));
        }

        return responseList;
    }

    @Override
    public CommissionRuleResponseDto getRuleByCategory(String categoryId) {
        CommissionRule rule = commissionRuleRepo.findByCategoryIdAndActiveTrue(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("No active commission rule found for category " + categoryId));

        return modelMapper.map(rule, CommissionRuleResponseDto.class);
    }

    @Override
    public ApiResponse updateRule(Long ruleId, CommissionRuleRequestDto req) {
        // ruleId + categoryId together act as a composite key here - this
        // rejects the update if the categoryId in the request doesn't match
        // the rule ruleId actually points to, instead of trusting ruleId alone.
        CommissionRule rule = commissionRuleRepo.findByIdAndCategoryId(ruleId, req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No commission rule found with id " + ruleId + " and category " + req.getCategoryId()));

        rule.setCommissionPercent(req.getCommissionPercent());

        commissionRuleRepo.save(rule);
        return new ApiResponse("SUCCESS", "Commission rule updated successfully with ID: " + ruleId);
    }

    @Override
    public ApiResponse deactivateRule(Long ruleId, String categoryId) {
        CommissionRule rule = commissionRuleRepo.findByIdAndCategoryId(ruleId, categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No commission rule found with id " + ruleId + " and category " + categoryId));

        rule.setActive(false);
        commissionRuleRepo.save(rule);
        return new ApiResponse("SUCCESS", "Commission rule deactivated successfully with ID: " + ruleId);
    }

    @Override
    public ApiResponse activateRule(Long ruleId, String categoryId) {
        CommissionRule rule = commissionRuleRepo.findByIdAndCategoryId(ruleId, categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No commission rule found with id " + ruleId + " and category " + categoryId));

        if (Boolean.TRUE.equals(rule.getActive())) {
            return new ApiResponse("SUCCESS", "Commission rule is already active");
        }

        deactivateCurrentActiveRule(categoryId);
        rule.setActive(true);
        commissionRuleRepo.save(rule);

        return new ApiResponse("SUCCESS", "Commission rule activated successfully with ID: " + ruleId);
    }
}
