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

import com.backend.dtos.request.CategoryRequest;
import com.backend.service.CategoryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

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
}

