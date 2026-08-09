package com.backend.dtos.response;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantResponse {

    private String variantId;

    private String sku;

    private Double mrp;
    
    private Double lowestPrice;
    
    private Long cheapestRetailerId;

    private List<ProductImageResponse> images;

    private Map<String, String> attributes;
}