package com.backend.service;

import java.util.List;

import com.backend.dtos.request.SubCategoryRequest;
import com.backend.dtos.request.SubCategoryUpdateRequest;
import com.backend.dtos.response.ApiResponse;
import com.backend.dtos.response.SubCategoryResponse;

public interface SubCategoryService {

	ApiResponse addSubCategory(SubCategoryRequest dto);

	List<SubCategoryResponse> getAllSubCategories();

	SubCategoryResponse getSubCategoryById(String id);

	ApiResponse updateById(String id, SubCategoryUpdateRequest dto);

	ApiResponse deleteById(String id);
	
	void deleteSubCatsByCatId(String catId);

	List<SubCategoryResponse> getSubCatsByCatId(String catId);
	
}
