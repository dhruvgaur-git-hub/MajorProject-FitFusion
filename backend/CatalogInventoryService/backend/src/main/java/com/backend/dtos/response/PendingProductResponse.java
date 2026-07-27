package com.backend.dtos.response;

import java.time.LocalDateTime;

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
public class PendingProductResponse {
	
	private String id;

    private String name;

    private String description;
    
    //private String primaryImage;

    private String subCategoryName;

    private String brandName;

    private String retailerName;

    private ProductStatus status;

    private Boolean active;

    private LocalDateTime createdAt;
}
