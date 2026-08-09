package com.backend.dtos;

import java.time.LocalDateTime;
import java.util.List;

import com.backend.entities.ShippingAddress;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceRequestDto {

    private Long orderId;

    private Long customerId;

    private ShippingAddressDto shippingAddress;

    private Double totalAmount;

    private String paymentStatus;

    private LocalDateTime createdAt;

    private List<InvoiceItemDto> items;
}