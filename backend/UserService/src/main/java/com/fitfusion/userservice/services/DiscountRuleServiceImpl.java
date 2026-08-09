package com.fitfusion.userservice.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fitfusion.userservice.dtos.ApiResponse;
import com.fitfusion.userservice.dtos.DiscountRuleRequestDto;
import com.fitfusion.userservice.dtos.DiscountRuleResponseDto;
import com.fitfusion.userservice.entities.DiscountRule;
import com.fitfusion.userservice.exceptions.ResourceNotFoundException;
import com.fitfusion.userservice.repositories.DiscountRuleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DiscountRuleServiceImpl implements DiscountRuleService {

    private final DiscountRuleRepository discountRuleRepo;
    private final ModelMapper modelMapper;

    @Override
    public ApiResponse createRule(DiscountRuleRequestDto req) {
        // If a row already exists for this exact category + percent (active
        // or not), reuse it instead of inserting a duplicate
        Optional<DiscountRule> matchingRule = discountRuleRepo.findByCategoryIdAndDiscountPercent(
                req.getCategoryId(), req.getDiscountPercent());

        if (matchingRule.isPresent()) {
            DiscountRule rule = matchingRule.get();
            if (rule.getActive()) {
                // Already the active rule for this category with this exact
                // percent - nothing actually changed, so do nothing.
                return new ApiResponse("SUCCESS", "Discount rule already active for category " + req.getCategoryId());
            }

            // It exists but is inactive (an old, superseded version) -
            // reactivate that same row instead of creating a new one.
            deactivateCurrentActiveRule(req.getCategoryId());
            rule.setActive(true);
            discountRuleRepo.save(rule);
            return new ApiResponse("SUCCESS", "Discount rule reactivated successfully");
        }

        // Genuinely new percent for this category - supersede whatever is
        // currently active and insert a new row.
        deactivateCurrentActiveRule(req.getCategoryId());

        DiscountRule rule = modelMapper.map(req, DiscountRule.class);
        rule.setActive(true);

        discountRuleRepo.save(rule);
        return new ApiResponse("SUCCESS", "Discount rule created successfully");
    }

    private void deactivateCurrentActiveRule(String categoryId) {
        Optional<DiscountRule> existingActiveRule = discountRuleRepo.findByCategoryIdAndActiveTrue(categoryId);
        if (existingActiveRule.isPresent()) {
            DiscountRule oldRule = existingActiveRule.get();
            oldRule.setActive(false);
            discountRuleRepo.save(oldRule);
        }
    }

    @Override
    public List<DiscountRuleResponseDto> getAllRules() {
        List<DiscountRule> rules = discountRuleRepo.findAll();
        List<DiscountRuleResponseDto> responseList = new ArrayList<>();

        for (DiscountRule rule : rules) {
            responseList.add(modelMapper.map(rule, DiscountRuleResponseDto.class));
        }

        return responseList;
    }

    @Override
    public DiscountRuleResponseDto getRuleByCategory(String categoryId) {
        DiscountRule rule = discountRuleRepo.findByCategoryIdAndActiveTrue(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("No active discount rule found for category " + categoryId));

        return modelMapper.map(rule, DiscountRuleResponseDto.class);
    }

    @Override
    public ApiResponse updateRule(Long ruleId, DiscountRuleRequestDto req) {
        // ruleId + categoryId together act as a composite key here - this
        // rejects the update if the categoryId in the request doesn't match
        // the rule ruleId actually points to, instead of trusting ruleId alone.
        DiscountRule rule = discountRuleRepo.findByIdAndCategoryId(ruleId, req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No discount rule found with id " + ruleId + " and category " + req.getCategoryId()));

        rule.setDiscountPercent(req.getDiscountPercent());

        discountRuleRepo.save(rule);
        return new ApiResponse("SUCCESS", "Discount rule updated successfully with ID: " + ruleId);
    }

    @Override
    public ApiResponse deactivateRule(Long ruleId, String categoryId) {
        DiscountRule rule = discountRuleRepo.findByIdAndCategoryId(ruleId, categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No discount rule found with id " + ruleId + " and category " + categoryId));

        rule.setActive(false);
        discountRuleRepo.save(rule);
        return new ApiResponse("SUCCESS", "Discount rule deactivated successfully with ID: " + ruleId);
    }

    @Override
    public ApiResponse activateRule(Long ruleId, String categoryId) {
        DiscountRule rule = discountRuleRepo.findByIdAndCategoryId(ruleId, categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No discount rule found with id " + ruleId + " and category " + categoryId));

        if (Boolean.TRUE.equals(rule.getActive())) {
            return new ApiResponse("SUCCESS", "Discount rule is already active");
        }

        deactivateCurrentActiveRule(categoryId);
        rule.setActive(true);
        discountRuleRepo.save(rule);

        return new ApiResponse("SUCCESS", "Discount rule activated successfully with ID: " + ruleId);
    }
}
