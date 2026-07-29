package com.backend.dtos.response;

import java.time.LocalDateTime;
import java.util.List;
import com.backend.entites.mongo.ProductStatus;

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
public class ProductResponse {

    private String id;

    private String categoryId;
    private String categoryName;

    private String subCategoryId;
    private String subCategoryName;

    private String brandId;
    private String brandName;

    private String name;
    
    private String primaryImage;

    private String description;

    private String productCode;

    private ProductStatus status;

    private List<ProductVariantResponse> variants;

    private LocalDateTime createdAt;

    private LocalDateTime approvedAt;
}