package com.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custom_exceptions.ResourceNotFoundException;
import com.backend.dtos.request.SubCategoryRequest;
import com.backend.dtos.request.SubCategoryUpdateRequest;
import com.backend.dtos.response.ApiResponse;
import com.backend.dtos.response.SubCategoryResponse;
import com.backend.entites.mongo.SubCategory;
import com.backend.repository.CategoryRepository;
import com.backend.repository.SubCategoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class SubCategoryServiceImpl implements SubCategoryService {
	
	private final CategoryRepository categoryRepo;
	private final SubCategoryRepository subCategoryRepo;
	private final ModelMapper mapper;

	@Override
	public ApiResponse addSubCategory(SubCategoryRequest dto) {

	    log.info("Creating subcategory '{}'", dto.getName());
	    
	    if (!categoryRepo.existsById(dto.getCategoryId())) {
	        throw new ResourceNotFoundException("Category Not Found!!");
	    }

	    SubCategory subCategory = mapper.map(dto, SubCategory.class);
	    subCategory.setActive(true);

	    subCategoryRepo.save(subCategory);

	    log.info("SubCategory '{}' saved successfully with Id {}", subCategory.getName(), subCategory.getId());

	    return new ApiResponse("SUCCESS", "SubCategory added successfully");
	}

	@Override
	public List<SubCategoryResponse> getAllSubCategories() {

	    log.info("Fetching all subcategories");

	    List<SubCategory> lst = subCategoryRepo.findAll();

	    List<SubCategoryResponse> resp = new ArrayList<>();

	    lst.forEach(subCategory -> {
	        SubCategoryResponse subResp = mapper.map(subCategory, SubCategoryResponse.class);
	        resp.add(subResp);
	    });

	    log.info("Successfully fetched {} subcategories", resp.size());

	    return resp;
	}

	@Override
	public SubCategoryResponse getSubCategoryById(String id) {

	    log.info("Trying to fetch SubCategory By {}", id);

	    SubCategory subCategory = subCategoryRepo.findById(id)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("SubCategory Not Found!!"));

	    log.info("SubCategory '{}' found by Id {}", subCategory.getName(), subCategory.getId());

	    SubCategoryResponse resp = mapper.map(subCategory, SubCategoryResponse.class);

	    log.info("SubCategory '{}' mapped successfully with DTO", resp.getName());

	    return resp;
	}
	
	@Override
	public List<SubCategoryResponse> getSubCatsByCatId(String catId) {

	    log.info("Trying to fetch subcategories for Category ID {}", catId);

	    if (!categoryRepo.existsById(catId)) {
	        log.warn("Category with ID {} not found", catId);
	        throw new ResourceNotFoundException("Category Not Found!!");
	    }

	    log.info("Category with ID {} found", catId);

	    List<SubCategory> subCategories = subCategoryRepo.findByCategoryId(catId);

	    List<SubCategoryResponse> resp = new ArrayList<>();

	    subCategories.forEach(subCategory -> {
	        SubCategoryResponse subResp = mapper.map(subCategory, SubCategoryResponse.class);
	        resp.add(subResp);
	    });

	    log.info("Successfully fetched {} subcategories for Category ID {}", resp.size(), catId);

	    return resp;
	}

	@Override
	public ApiResponse updateById(String id, SubCategoryUpdateRequest dto) {

	    log.info("Trying to update SubCategory with ID {}", id);

	    SubCategory subCategory = subCategoryRepo.findById(id)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("SubCategory Not Found!!"));

	    log.info("SubCategory '{}' found for update", subCategory.getName());

	    subCategory.setName(dto.getName());
	    subCategory.setDescription(dto.getDescription());

	    subCategoryRepo.save(subCategory);

	    log.info("SubCategory '{}' updated successfully", subCategory.getName());

	    return new ApiResponse("SUCCESS", "SubCategory Updated Successfully");
	}

	@Override
	public ApiResponse deleteById(String id) {

	    log.info("Trying to delete SubCategory with ID {}", id);

	    SubCategory subCategory = subCategoryRepo.findById(id)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("SubCategory Not Found!!"));

	    log.info("SubCategory '{}' found for deletion", subCategory.getName());

	    subCategory.setActive(false);

	    subCategoryRepo.save(subCategory);

	    log.info("SubCategory '{}' marked as inactive successfully", subCategory.getName());

	    return new ApiResponse("SUCCESS", "SubCategory Deleted Successfully");
	}

	@Override
	public void deleteSubCatsByCatId(String catId) {
		
		log.info("Marking all subcategories inactive for Category ID {}", catId);
		
		List<SubCategory> subCats = subCategoryRepo.findByCategoryId(catId);
		
		subCats.forEach(subCat -> subCat.setActive(false));
		
		subCategoryRepo.saveAll(subCats);
		
		log.info("Successfully marked {} subcategories inactive", subCats.size());
	}

	@Override
	public void validateSubCat(String id) {

		if (!subCategoryRepo.existsById(id)) {
			throw new ResourceNotFoundException("SubCategory Not Found!!");
		}
	}
}
