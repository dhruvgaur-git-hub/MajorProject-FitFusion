package com.backend.dtos.request;

import java.util.List;

import com.backend.entites.mongo.AttributeType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class AttributeFieldRequest {

    @NotBlank(message = "Attribute name is required")
    private String name;

    @NotNull(message = "Attribute type is required")
    private AttributeType type;

    @NotNull(message = "Required flag is mandatory")
    private Boolean required;

    private List<String> allowedValues;
}
