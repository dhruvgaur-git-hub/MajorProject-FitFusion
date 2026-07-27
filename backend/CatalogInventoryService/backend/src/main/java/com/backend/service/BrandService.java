package com.backend.service;

import java.util.List;

import com.backend.dtos.request.BrandRequest;
import com.backend.dtos.response.ApiResponse;
import com.backend.dtos.response.BrandResponse;

public interface BrandService {

	ApiResponse addBrand(BrandRequest dto);

	List<BrandResponse> getAllBrands();

	BrandResponse getBrandById(String id);

	ApiResponse updateById(String id, BrandRequest dto);

	ApiResponse deleteById(String id);
	
	void validateBrand(String id);

}
