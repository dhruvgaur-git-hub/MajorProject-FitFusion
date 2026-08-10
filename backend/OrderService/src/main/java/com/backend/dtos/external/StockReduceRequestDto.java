package com.backend.dtos.external;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Request body sent to CatalogInventoryService's stock-reduce endpoint
// once a payment has been confirmed for an order item.
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StockReduceRequestDto {
	private Integer quantity;
}
