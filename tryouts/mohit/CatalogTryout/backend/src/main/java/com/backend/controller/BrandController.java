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

import com.backend.dtos.request.BrandRequest;
import com.backend.service.BrandService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/brands")
@RequiredArgsConstructor
public class BrandController {
	private final BrandService brandService;

    @PostMapping("/addbrand")
    public ResponseEntity<?> addBrand(@RequestBody BrandRequest dto) {
    	
    	log.info("Received request to add Brand by {}", dto.getName());
    	
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(brandService.addBrand(dto));

    }
    
    @GetMapping("/fetchAllBrands")
    public ResponseEntity<?> getAllBrands(){
    	
    	log.info("Received request to fetch All Brands");
    	
    	return ResponseEntity
    			.status(HttpStatus.OK)
    			.body(brandService.getAllBrands());
    }
    
    @GetMapping("/fetchById/{id}")
    public ResponseEntity<?> getBrandById(@PathVariable String id){
    	
    	log.info("Received request to fetch brand by {}", id);
    	
    	return ResponseEntity.ok(brandService.getBrandById(id));
    }
    
    
    @PutMapping("/updateById/{id}")
    public ResponseEntity<?> updateById(@PathVariable String id, @RequestBody BrandRequest dto ){
    	
    	log.info("Received request to update brand by {}", id);
    	
    	return ResponseEntity.ok(brandService.updateById(id, dto));
    }
    
    @DeleteMapping("/deleteById/{id}")
    public ResponseEntity<?> deleteById(@PathVariable String id){
    	
    	log.info("Received request to delete brand by {}", id);
    	
    	return ResponseEntity.ok(brandService.deleteById(id));
    }
}
