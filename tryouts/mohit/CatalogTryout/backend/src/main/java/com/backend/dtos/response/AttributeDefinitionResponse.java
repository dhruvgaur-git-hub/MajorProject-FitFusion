package com.backend.dtos.response;

import java.util.List;

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
public class AttributeDefinitionResponse {

    private String id;

    private String subCategoryId;

    private List<AttributeFieldResponse> attributes;

    private Boolean active;
}