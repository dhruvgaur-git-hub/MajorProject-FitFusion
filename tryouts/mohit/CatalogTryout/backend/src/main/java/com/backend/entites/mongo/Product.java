package com.backend.entites.mongo;

import java.time.LocalDateTime;

import java.util.List;

import org.springframework.data.annotation.Id;
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

    private String createdBy;      // Who submitted it

    private String approvedBy;      // Admin ID

    private ProductStatus status;   // PENDING, APPROVED, REJECTED

    private String rejectionReason;

    private String categoryId;

    private String brandId;

    private String name;

    private String description;

    private Boolean active;

    private List<ProductVariant> variants;

    private LocalDateTime createdAt;

    private LocalDateTime approvedAt;
    
    private LocalDateTime updatedAt;
}