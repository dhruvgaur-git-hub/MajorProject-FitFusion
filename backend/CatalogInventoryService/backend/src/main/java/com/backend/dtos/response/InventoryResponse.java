package com.backend.dtos.response;

import java.time.LocalDateTime;

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
public class InventoryResponse {

    private String id;
    
    private String productId;
    
    private String variantId;
    
    private String sku;
    
    private Long retailerId;
    
    private Integer quantity;
    
    private Integer reservedQuantity;
    
    private Double retailerQuotedPrice;
    
    private Boolean active;
    
    private LocalDateTime updatedAt;
}