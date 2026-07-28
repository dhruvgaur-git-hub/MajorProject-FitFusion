package com.fitfusion.userservice.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * One discount rate per catalog category, e.g. "Health Supplements -> 10%
 * off". Same categoryId-as-String note as CommissionRule: it references a
 * MongoDB category from the Catalog/Inventory service, not a local FK.
 *
 * "Deleting" a rule flips active to false instead of removing the row - see
 * CommissionRule for why.
 */
@Entity
@Table(name = "discount_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DiscountRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    // Not unique at the DB level - ruleId + categoryId together identify a
    // rule (see the composite check in DiscountRuleService.updateRule).
    // Only one row per category may have active = true at a time, but
    // inactive historical rows can share a categoryId with the active one.
    @NotNull(message = "Category ID is required")
    @Column(name = "category_id", nullable = false)
    private String categoryId;

    @NotNull(message = "Discount percentage is required")
    @Min(value = 0, message = "Discount percentage cannot be negative")
    @Max(value = 100, message = "Discount percentage cannot exceed 100%")
    @Column(name = "discount_percent", nullable = false)
    private Double discountPercent;

    @Column(nullable = false)
    private Boolean active = false ;
}
