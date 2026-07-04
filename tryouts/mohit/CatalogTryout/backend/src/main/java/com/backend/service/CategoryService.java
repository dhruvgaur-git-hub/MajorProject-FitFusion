package com.backend.service;

import java.util.List;

import com.backend.dtos.request.CategoryRequest;
import com.backend.dtos.response.ApiResponse;
import com.backend.dtos.response.CategoryResponse;

public interface CategoryService {

	ApiResponse addCategory(CategoryRequest dto);

	List<CategoryResponse> getAllCategories();

	ApiResponse updateById(String id, CategoryRequest request);

	ApiResponse deleteById(String id);

	CategoryResponse getCategoryById(String id);
}
