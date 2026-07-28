package com.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
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

	@NotBlank(message = "Product Id is required")
	private String productId;

	@NotBlank(message = "Variant Id is required")
	private String variantId;

	@NotBlank(message = "SKU is required")
	private String sku;

	@NotBlank(message = "Product name is required")
	private String productName;

	@NotNull(message = "Retailer Id is required")
	private Long retailerId;

	@NotNull(message = "Quantity is required")
	@Positive(message = "Quantity must be greater than zero")
	private Integer quantity;

	@NotNull(message = "MRP is required")
	@Positive(message = "MRP must be greater than zero")
	private Double mrp;

	@NotNull(message = "Retailer quoted price is required")
	@Positive(message = "Retailer quoted price must be greater than zero")
	private Double retailerQuotedPrice;

	@NotNull(message = "Commission percent is required")
	@PositiveOrZero(message = "Commission percent cannot be negative")
	private Double commissionPercent;

	@NotNull(message = "Discount percent is required")
	@PositiveOrZero(message = "Discount percent cannot be negative")
	private Double discountPercent;
}
