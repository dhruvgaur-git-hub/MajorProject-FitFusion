package com.fitfusion.userservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommissionRuleRequestDto {
    private String categoryId;
    private Double commissionPercent;
}
