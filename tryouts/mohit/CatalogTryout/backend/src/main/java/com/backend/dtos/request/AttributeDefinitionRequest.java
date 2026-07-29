package com.backend.dtos.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
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
public class AttributeDefinitionRequest {

    @NotBlank(message = "Subcategory is required")
    private String subCategoryId;

    @NotEmpty(message = "At least one attribute is required")
    private List<AttributeFieldRequest> attributes;
}