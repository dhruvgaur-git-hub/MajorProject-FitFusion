package com.backend.dtos;

import java.util.List;

import com.backend.entities.ShippingAddress;

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
	private Long customerId;

	private ShippingAddress shippingAddress;

	private List<OrderItemRequestDto> items;
}
