package com.backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscountRuleResponseDto {
    private Long id;
    private String categoryId;
    private Double discountPercent;
    private Boolean active;
}
