package com.backend.entites.mongo;

import java.time.LocalDateTime;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

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
@Document(collection = "products")
public class Product {

    @Id
    private String id;
    
    private String productCode;     
                                   
   	private Integer nextSku; 
   
    private Long createdByRetailerId;       // retailer id

    private Long approvedByAdminId;      // admin id

    private ProductStatus status;   // PENDING, APPROVED, REJECTED, DISABLED

    private String rejectionReason;
    
    private String categoryId; 

    private String subCategoryId;

    private String brandId;

    @Indexed(unique=true)
    private String name;

    private String description;
    
    private String primaryImage;
    
    private Double startingPrice;

    private List<ProductVariant> variants;

    private LocalDateTime createdAt;

    private LocalDateTime approvedAt;
    
    private LocalDateTime updatedAt;
}
