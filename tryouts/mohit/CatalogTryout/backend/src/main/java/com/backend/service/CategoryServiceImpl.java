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

@Service
@Transactional
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
	
	private final CategoryRepository categoryRepo;
	private final ModelMapper mapper;
	
	@Override
	public ApiResponse addCategory(CategoryRequest dto) {
		
		Category category = mapper.map(dto, Category.class);
		category.setActive(true);
		
		categoryRepo.save(category);
		
		return new ApiResponse("SUCCESS", "Category added successfully");
	}
	
	@Override
	public CategoryResponse getCategoryById(String id) {
		
		Category category = categoryRepo.findById(id)
				.orElseThrow(() -> 
					new ResourceNotFoundException("Category Not Found!!"));
		
		return mapper.map(category, CategoryResponse.class);
	}

	@Override
	public List<CategoryResponse> getAllCategories() {
		
		List<Category> lst = categoryRepo.findAll();
		
		List<CategoryResponse> resp = new ArrayList<>();
		
		lst.forEach((category)->{
			CategoryResponse catResp = mapper.map(category, CategoryResponse.class);
			resp.add(catResp);
		});
		
		return resp;
	}

	@Override
	public ApiResponse updateById(String id, CategoryRequest request) {
		
		Category category = categoryRepo.findById(id)
				.orElseThrow(() -> 
					new ResourceNotFoundException("Category Not Found!!"));
		
		category.setName(request.getName());
		category.setDescription(request.getDescription());
		
		categoryRepo.save(category);
		
		return new ApiResponse("Success", "Category Saved Successfully");
	}

	@Override
	public ApiResponse deleteById(String id) {
		
		Category category = categoryRepo.findById(id)
				.orElseThrow(()-> new ResourceNotFoundException("Category Not Found!!"));
		
		category.setActive(false);
		
		categoryRepo.save(category);
		return new ApiResponse("Success", "Category Deleted Successfully");
	}
}
