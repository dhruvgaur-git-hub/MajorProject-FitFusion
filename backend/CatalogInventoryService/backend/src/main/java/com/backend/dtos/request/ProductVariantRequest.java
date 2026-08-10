package com.backend.dtos.request;

import java.util.Map;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class ProductVariantRequest {

    @NotNull(message = "MRP is required")
    @Positive(message = "MRP must be greater than 0")
    private Double mrp;

    @NotEmpty(message = "At least one attribute is required")
    private Map<String, String> attributes;
}