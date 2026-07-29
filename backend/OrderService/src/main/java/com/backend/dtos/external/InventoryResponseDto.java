package com.backend.dtos.external;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InventoryResponseDto {
	private String id;
	private String productId;
	private String variantId;
	private Long retailerId;
	private Integer quantity;
	private Integer reservedQuantity;
	private Double retailerQuotedPrice;
	private Boolean active;
	private LocalDateTime updatedAt;
}