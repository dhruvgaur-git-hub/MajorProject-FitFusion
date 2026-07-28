package com.backend.dtos.request;

import com.backend.dtos.response.CategoryResponse;

import jakarta.validation.constraints.Min;
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
public class InventoryUpdateRequest {

    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @Min(value = 0, message = "Price cannot be negative")
    private Double retailerQuotedPrice;

    private Boolean active;
}