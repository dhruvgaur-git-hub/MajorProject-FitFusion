package com.backend.entites.mongo;

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
public class AttributeField {
	
	private String name;

    private AttributeType type;

    private Boolean required;

    private List<String> allowedValues;
}
