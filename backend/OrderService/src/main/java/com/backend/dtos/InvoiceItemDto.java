package com.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceItemDto {

    private String productName;

    private String sku;

    private Integer quantity;

    private Double mrp;

    private Double retailerQuotedPrice;

    private Double commissionPercent;

    private Double discountPercent;

    private Double sellingPrice;

    private Double subtotal;
}