package com.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dtos.request.CategoryRequest;
import com.backend.service.CategoryService;
import com.backend.service.SubCategoryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final SubCategoryService subCategoryService;

    @PostMapping("/addcategory")
    public ResponseEntity<?> addCategory(@RequestBody CategoryRequest dto) {
    	
    	log.info("Received request to add category by {}", dto.getName());
    	
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(categoryService.addCategory(dto));

    }
    
    @GetMapping("/fetchAllCategories")
    public ResponseEntity<?> getAllCategories(){
    	
    	log.info("Received request to fetch All Categories");
    	
    	return ResponseEntity
    			.status(HttpStatus.OK)
    			.body(categoryService.getAllCategories());
    }
    
    @GetMapping("/fetchById/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable String id){
    	
    	log.info("Received request to fetch category by {}", id);
    	
    	return ResponseEntity.ok(categoryService.getCategoryById(id));
    }
    
    @GetMapping("/fetchSubCatsByCatId/{catId}")
    public ResponseEntity<?> getSubCatsByCatId(@PathVariable String catId){
    	
    	log.info("Received request to fetch SubCats by CatID {}", catId);
    	
    	return ResponseEntity.ok(subCategoryService.getSubCatsByCatId(catId));
    }
    
    
    @PutMapping("/updateById/{id}")
    public ResponseEntity<?> updateById(@PathVariable String id, @RequestBody CategoryRequest dto ){
    	
    	log.info("Received request to update categpry by {}", id);
    	
    	return ResponseEntity.ok(categoryService.updateById(id, dto));
    }
    
    @DeleteMapping("/deleteById/{id}")
    public ResponseEntity<?> deleteById(@PathVariable String id){
    	
    	log.info("Received request to delete categpry by {}", id);
    	
    	return ResponseEntity.ok(categoryService.deleteById(id));
    }
    
    @PatchMapping("/{id}/restore")
    public ResponseEntity<?> restoreCategory(@PathVariable String id) {

        log.info("Received request to restore category with id {}", id);

        return ResponseEntity.ok(categoryService.restoreCategory(id));
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getCategoryStats() {

        log.info("Received request to fetch category statistics");

        return ResponseEntity.ok(categoryService.getCategoryStats());
    }
    
}

