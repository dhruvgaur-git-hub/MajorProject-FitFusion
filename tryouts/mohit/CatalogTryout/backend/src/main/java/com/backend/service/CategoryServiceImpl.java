package com.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custom_exceptions.ResourceNotFoundException;
import com.backend.dtos.request.CategoryRequest;
import com.backend.dtos.response.ApiResponse;
import com.backend.dtos.response.CategoryResponse;
import com.backend.entites.mongo.Category;
import com.backend.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
	
	private final SubCategoryService subCategoryService;
	private final CategoryRepository categoryRepo;
	private final ModelMapper mapper;
	
	@Override
	public ApiResponse addCategory(CategoryRequest dto) {
		
		log.info("Creating category '{}'", dto.getName());
		
		Category category = mapper.map(dto, Category.class);
		category.setActive(true);
		
		categoryRepo.save(category);
		
		log.info("Category '{}' saved successfully with Id {}", category.getName(), category.getId());
		
		return new ApiResponse("SUCCESS", "Category added successfully");
	}
	
	@Override
	public CategoryResponse getCategoryById(String id) {
		
		log.info("Trying to fetch Category By {}", id);
		
		Category category = categoryRepo.findById(id)
				.orElseThrow(() -> 
					new ResourceNotFoundException("Category Not Found!!"));
		
		log.info("Category '{}' found by Id {}", category.getName(), category.getId());
		
		CategoryResponse resp = mapper.map(category, CategoryResponse.class);
		
		log.info("Category '{}' mapped successfully with DTO",resp.getName());
		
		return resp;
	}

	@Override
	public List<CategoryResponse> getAllCategories() {

	    log.info("Fetching all categories");

	    List<Category> lst = categoryRepo.findAll();

	    List<CategoryResponse> resp = new ArrayList<>();

	    lst.forEach(category -> {
	        CategoryResponse catResp = mapper.map(category, CategoryResponse.class);
	        resp.add(catResp);
	    });

	    log.info("Successfully fetched {} categories", resp.size());

	    return resp;
	}

	@Override
	public ApiResponse updateById(String id, CategoryRequest request) {

	    log.info("Trying to update Category with ID {}", id);

	    Category category = categoryRepo.findById(id)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("Category Not Found!!"));

	    log.info("Category '{}' found for update", category.getName());

	    category.setName(request.getName());
	    category.setDescription(request.getDescription());

	    categoryRepo.save(category);

	    log.info("Category '{}' updated successfully", category.getName());

	    return new ApiResponse("Success", "Category Updated Successfully");
	}

	@Override
	public ApiResponse deleteById(String id) {

	    log.info("Trying to delete Category with ID {}", id);

	    Category category = categoryRepo.findById(id)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("Category Not Found!!"));

	    log.info("Category '{}' found for deletion", category.getName());

	    category.setActive(false);
	    
	    subCategoryService.deleteSubCatsByCatId(id);

	    categoryRepo.save(category);

	    log.info("Category '{}' marked as inactive successfully", category.getName());
	    
	    return new ApiResponse("Success", "Category Deleted Successfully");
	}
}
