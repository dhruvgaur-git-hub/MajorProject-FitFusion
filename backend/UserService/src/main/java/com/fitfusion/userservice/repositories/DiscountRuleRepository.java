package com.fitfusion.userservice.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fitfusion.userservice.entities.DiscountRule;

@Repository
public interface DiscountRuleRepository extends JpaRepository<DiscountRule, Long> {

    // Finds the active discount rule for a given categoryId, if it exists.
    Optional<DiscountRule> findByCategoryIdAndActiveTrue(String categoryId);

    // Checks if an active discount rule exists for a given categoryId.
    boolean existsByCategoryIdAndActiveTrue(String categoryId);

    // Finds a discount rule by its ID and categoryId, if it exists.
    Optional<DiscountRule> findByIdAndCategoryId(Long id, String categoryId);

    // Finds a rule (active or inactive) for this category that already has
    // this exact percent - used by createRule to reuse/reactivate an
    // existing row instead of inserting a duplicate with the same values.
    Optional<DiscountRule> findByCategoryIdAndDiscountPercent(String categoryId, Double discountPercent);
}
