package com.backend.dtos.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryRequest {

    @NotBlank(message = "Product ID is required")
    private String productId;

    @NotBlank(message = "Variant ID is required")
    private String variantId;

    @NotBlank(message = "Retailer ID is required")
    private String retailerId;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @NotNull(message = "Retailer quoted price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private Double retailerQuotedPrice;

}