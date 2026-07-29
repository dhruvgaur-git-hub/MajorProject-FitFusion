package com.backend.entites.mongo;

import java.time.LocalDateTime;

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
@Document(collection = "inventories")
public class Inventory {

    @Id
    private String id;

    private String productId;          

    private String variantId;          

    private String retailerId;         

    private Integer quantity;          

    private Integer reservedQuantity;  

    private Double retailerQuotedPrice;

    private Boolean active;            

    private LocalDateTime updatedAt;   
    
}