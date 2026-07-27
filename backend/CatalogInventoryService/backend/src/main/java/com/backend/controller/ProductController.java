package com.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dtos.request.ProductAddRequest;
import com.backend.dtos.request.ProductUpdateRequest;
import com.backend.dtos.request.ProductVariantRequest;
import com.backend.service.ProductService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Validated
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

	private final ProductService productService;

	@PostMapping("/addProduct")
	public ResponseEntity<?> addProduct(@RequestBody @Valid ProductAddRequest prod) {

		return ResponseEntity.status(HttpStatus.CREATED).body(productService.addProduct(prod));
	}

	@GetMapping("/pending")
	public ResponseEntity<?> fetchAllPendingProd(){
		return ResponseEntity.ok(productService.getAllPending());
	}

	@PutMapping("/{id}/approve")
	public ResponseEntity<?> approveProduct(@PathVariable String id, @RequestParam String productCode){
		return ResponseEntity.ok(productService.approveProduct(id, productCode));
	}
	
	@PutMapping("/{id}/reject")
	public ResponseEntity<?> rejectProduct(@PathVariable String id, @RequestBody String reason){
		return ResponseEntity.ok(productService.rejectProduct(id, reason));
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteProduct(@PathVariable String id){
		return ResponseEntity.ok(productService.deleteProduct(id));
	}
	
	
	@PostMapping("/{productId}/variant")
	public ResponseEntity<?> addProductVariant(@PathVariable String productId, @RequestBody @Valid ProductVariantRequest prodVarReq){
		return ResponseEntity.ok(productService.addVariant(productId, prodVarReq));
	}
	
	@GetMapping("/catalog")
	public ResponseEntity<?> fetchViewProducts(){
		return ResponseEntity.ok(productService.getViewProducts());
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> fetchProduct(@PathVariable String id){
		return ResponseEntity.ok(productService.getProduct(id));
	}
	
	@DeleteMapping("/{pid}/variant/{vid}")
	public ResponseEntity<?> deleteVariant(@PathVariable String pid, @PathVariable String vid){
		return ResponseEntity.ok(productService.deleteProductVariant(pid, vid));
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> updateProduct(@PathVariable String id, @RequestBody @Valid ProductUpdateRequest prod){
		return ResponseEntity.ok(productService.updateProduct(id, prod));
	}
		
	@PutMapping("/{pid}/variant/{vid}")
	public ResponseEntity<?> updateProductVariant(@PathVariable String pid, @PathVariable String vid, @RequestBody @Valid ProductVariantRequest var){
		return ResponseEntity.ok(productService.updateProductVariant(pid,vid, var));
	}
	
	@GetMapping("/category/{catId}")
	public ResponseEntity<?> fetchProductsByCategory(@PathVariable String catId){
		return ResponseEntity.ok(productService.getProductsByCategory(catId));
	}
	
	@GetMapping("/brand/{brandId}")
	public ResponseEntity<?> fetchProductsByBrand(@PathVariable String brandId){
		return ResponseEntity.ok(productService.getProductsByBrand(brandId));
	}
	
	@GetMapping("/subCategpry/{subCatId}")
	public ResponseEntity<?> fetchProductsBySubCat(@PathVariable String subCatId){
		return ResponseEntity.ok(productService.getProductsBySubCat(subCatId));
	}	
}
