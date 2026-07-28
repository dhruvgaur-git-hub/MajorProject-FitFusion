package com.fitfusion.userservice.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fitfusion.userservice.entities.CommissionRule;

@Repository
public interface CommissionRuleRepository extends JpaRepository<CommissionRule, Long> {

    // Finds the active commission rule for a given categoryId, if it exists.
    Optional<CommissionRule> findByCategoryIdAndActiveTrue(String categoryId);

    // Checks if an active commission rule exists for a given categoryId.
    boolean existsByCategoryIdAndActiveTrue(String categoryId);
    
    // Finds a commission rule by its ID and categoryId, if it exists.
    Optional<CommissionRule> findByIdAndCategoryId(Long id, String categoryId);

    // Finds a rule (active or inactive) for this category that already has
    // this exact percent - used by createRule to reuse/reactivate an
    // existing row instead of inserting a duplicate with the same values.
    Optional<CommissionRule> findByCategoryIdAndCommissionPercent(String categoryId, Double commissionPercent);
}
