package com.backend.dtos.response;

import com.backend.entites.mongo.ProductStatus;

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
public class ProductSummaryResponse {

    private String id;

    private String name;

    private String description;

    private String productCode;

    private String subCategoryName;
    
    private String categoryName;

    private String brandName;

    private Double startingPrice;

    private String primaryImage;
    
    private ProductStatus status;
    
    private String rejectionReason;
}