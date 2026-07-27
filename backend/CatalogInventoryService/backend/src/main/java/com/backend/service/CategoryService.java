package com.backend.service;

import java.util.List;

import com.backend.dtos.dashboard.CategoryStatsResponse;
import com.backend.dtos.request.CategoryRequest;
import com.backend.dtos.response.ApiResponse;
import com.backend.dtos.response.CategoryResponse;

public interface CategoryService {

	ApiResponse addCategory(CategoryRequest dto);

	List<CategoryResponse> getAllCategories();
	
	List<CategoryResponse> getAllActiveCategories();

	ApiResponse updateById(String id, CategoryRequest request);

	ApiResponse deleteById(String id);

	CategoryResponse getCategoryById(String id);
	
	void validateCategory(String id);
	
	CategoryStatsResponse getCategoryStats();

	ApiResponse restoreCategory(String id);
}
