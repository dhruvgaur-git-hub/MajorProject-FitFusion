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
@Document(collection = "brands")
public class Brand {

    @Id
    private String id;

    private String name;

    private String description;

    private Boolean active;
    
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}