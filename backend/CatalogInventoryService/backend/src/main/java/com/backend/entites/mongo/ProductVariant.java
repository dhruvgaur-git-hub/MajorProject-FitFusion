package com.backend.entites.mongo;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {

    private String variantId;

    private String sku;

    private Double mrp;

    private List<ProductImage> images;

    private Map<String, String> attributes;
    
    private Boolean active;
    
    private Double lowestPrice;   
    
    private Long cheapestRetailerId;
}