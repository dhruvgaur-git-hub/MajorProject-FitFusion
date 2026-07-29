package com.fitfusion.userservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DiscountRuleRequestDto {
    private String categoryId;
    private Double discountPercent;
}
