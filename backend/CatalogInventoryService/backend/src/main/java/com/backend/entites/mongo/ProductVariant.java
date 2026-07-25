package com.backend.entites.mongo;

import java.util.List;
import java.util.Map;

public class ProductVariant {

    private String variantId;

    private String sku;

    private Double mrp;

    private List<ProductImage> images;

    private Map<String, String> attributes;
    
    private Boolean active;
}