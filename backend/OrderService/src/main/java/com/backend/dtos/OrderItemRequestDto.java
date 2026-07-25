package com.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemRequestDto {

	private String productId;

	private String variantId;

	private String sku;

	private String productName;

	private Long retailerId;

	private Integer quantity;

	private Double mrp;

	private Double retailerQuotedPrice;

	private Double commissionPercent;

	private Double discountPercent;
}
