package com.backend.dtos.response;

import java.util.List;

import com.backend.entites.mongo.AttributeType;

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
public class AttributeFieldResponse {

    private String name;

    private AttributeType type;

    private Boolean required;

    private List<String> allowedValues;
}