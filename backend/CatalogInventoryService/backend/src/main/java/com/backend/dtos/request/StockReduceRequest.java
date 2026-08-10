package com.backend.dtos.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Used by OrderService (service-to-service call) to deduct stock
// from an Inventory record once a payment is confirmed.
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockReduceRequest {

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

}
