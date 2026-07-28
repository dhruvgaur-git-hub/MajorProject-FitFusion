package com.fitfusion.userservice.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * One commission rate per catalog category, e.g. "Footwear -> 12%". The
 * amount a retailer is paid out for an order item is selling_price minus
 * this commission (see OrderService's Payouts).
 *
 * categoryId is a String, not a Long, because the Catalog/Inventory service
 * stores categories in MongoDB with ObjectId ids - it is intentionally NOT
 * a foreign key (categories live in a different service/database), just a
 * plain reference value.
 *
 * "Deleting" a rule doesn't remove the row - it flips active to false, so
 * historical orders that were calculated under this rule still have
 * something to point back to, and so the categoryId slot isn't silently
 * freed up for a completely different rule to reuse.
 */
@Entity
@Table(name = "commission_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommissionRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    // Not unique at the DB level - ruleId + categoryId together identify a
    // rule (see the composite check in CommissionRuleService.updateRule).
    // Only one row per category may have active = true at a time, but
    // inactive historical rows can share a categoryId with the active one.
    @NotNull(message = "Category ID is required")
    @Column(name = "category_id", nullable = false)
    private String categoryId;

    @NotNull(message = "Commission percentage is required")
    @Min(value = 2, message = "Commission percentage must be at least 2%")
    @Max(value = 100, message = "Commission percentage cannot exceed 100%")
    @Column(name = "commission_percent", nullable = false)
    private Double commissionPercent;

    @Column(nullable = false)
    private Boolean active = false ;
}
