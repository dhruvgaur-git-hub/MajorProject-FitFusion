package com.backend.dtos.response;

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
public class SubCategoryResponse {

	private String id;
	
	private String categoryId;
	
	private String name;
	
	private String description;
	
	private Boolean active;
}
