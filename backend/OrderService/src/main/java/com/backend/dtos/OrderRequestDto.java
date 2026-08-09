package com.backend.dtos;

import java.util.List;

import com.backend.entities.ShippingAddress;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
public class OrderRequestDto {
	
	@NotNull(message = "Customer Id is required")
	private Long customerId;

	@NotNull(message = "Shipping address is required")
	@Valid
	private ShippingAddress shippingAddress;

	@NotEmpty(message = "Order must contain at least one item")
	@Valid
	private List<OrderItemRequestDto> items;
}
