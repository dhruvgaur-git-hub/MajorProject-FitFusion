package com.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dtos.request.SubCategoryRequest;
import com.backend.dtos.request.SubCategoryUpdateRequest;
import com.backend.service.SubCategoryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/subcategories")
@RequiredArgsConstructor
public class SubCategoryController {
	private final SubCategoryService subCategoryService;

	@PostMapping("/addSubCategory")
	public ResponseEntity<?> addSubCategory(@RequestBody SubCategoryRequest dto) {

	    log.info("Received request to add subcategory '{}'", dto.getName());

	    return ResponseEntity
	            .status(HttpStatus.CREATED)
	            .body(subCategoryService.addSubCategory(dto));
	}

	@GetMapping("/fetchAllSubCategories")
	public ResponseEntity<?> getAllSubCategories() {

	    log.info("Received request to fetch all subcategories");

	    return ResponseEntity
	            .status(HttpStatus.OK)
	            .body(subCategoryService.getAllSubCategories());
	}

	@GetMapping("/fetchById/{id}")
	public ResponseEntity<?> getSubCategoryById(@PathVariable String id) {

	    log.info("Received request to fetch subcategory by ID {}", id);

	    return ResponseEntity.ok(subCategoryService.getSubCategoryById(id));
	}

	@PutMapping("/updateById/{id}")
	public ResponseEntity<?> updateById(@PathVariable String id,
	                                    @RequestBody SubCategoryUpdateRequest dto) {

	    log.info("Received request to update subcategory by ID {}", id);

	    return ResponseEntity.ok(subCategoryService.updateById(id, dto));
	}

	@DeleteMapping("/deleteById/{id}")
	public ResponseEntity<?> deleteById(@PathVariable String id) {

	    log.info("Received request to delete subcategory by ID {}", id);

	    return ResponseEntity.ok(subCategoryService.deleteById(id));
	}
	
	@GetMapping("/stats")
	public ResponseEntity<?> getSubCategoryStats() {

	    log.info("Received request to fetch subcategory statistics");

	    return ResponseEntity.ok(subCategoryService.getSubCatStats());
	}
}
