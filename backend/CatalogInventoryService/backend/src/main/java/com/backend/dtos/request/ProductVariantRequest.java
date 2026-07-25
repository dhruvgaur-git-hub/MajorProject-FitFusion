package com.backend.dtos.request;

import java.util.List;
import java.util.Map;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class ProductVariantRequest {
	
	@NotNull
	private Double mrp;

	@NotEmpty
	private List<ProductImageRequest> images;

	@NotEmpty
	private Map<String, String> attributes;
}
