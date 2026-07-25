package com.backend.dtos.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public class ProductRequest {

	 @NotBlank
	 private String categoryId;

	 @NotBlank
	 private String subCategoryId;

	 @NotBlank
	 private String brandId;

	 @NotBlank
	 private String name;

	 @NotBlank
	 private String description;

	 @NotEmpty
	 private List<ProductVariantRequest> variants;
}
