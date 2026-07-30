package com.backend.dtos.external;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommissionRuleResponseDto {
	private Long id;
	
	private String categoryId;
	
	private Double commissionPercent;
	
	private Boolean active;
}