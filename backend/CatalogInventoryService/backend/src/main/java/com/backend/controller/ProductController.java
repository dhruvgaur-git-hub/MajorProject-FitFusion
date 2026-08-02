package com.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
import com.backend.entites.mongo.ProductStatus;
import com.backend.security.JwtUser;
import com.backend.service.ProductService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Validated
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("/addProduct")
    public ResponseEntity<?> addProduct(
    		@AuthenticationPrincipal JwtUser jwtUser,
    		@RequestBody @Valid ProductAddRequest prod) {

    	Long retailerId = jwtUser.getUserId();
        log.info("Received request to add product");

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.addProduct(retailerId, prod));
    }
    
 

    @GetMapping("/pending")
    public ResponseEntity<?> fetchAllPendingProd() {

        log.info("Received request to fetch all pending products");

        return ResponseEntity.ok(productService.getAllPending());
    }

    // Unified Status update endpoint
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateProductStatus(
            @AuthenticationPrincipal JwtUser jwtUser,
            @PathVariable String id,
            @RequestParam ProductStatus status,
            @RequestParam(required = false) String productCode,
            @RequestBody(required = false) String reason) {

        log.info("Received request to update status of product {} to {}", id, status);

        return ResponseEntity.ok(
            productService.updateProductStatus(id, status, productCode, reason, jwtUser.getUserId())
        );
    }

    @PostMapping("/{productId}/variant")
    public ResponseEntity<?> addProductVariant(
    		@PathVariable String productId,
            @RequestBody @Valid ProductVariantRequest prodVarReq) {

        log.info("Received request to add variant to product {}", productId);

        return ResponseEntity.ok(productService.addVariant(productId, prodVarReq));
    }

    @GetMapping("/catalog")
    public ResponseEntity<?> fetchViewProducts() {

        log.info("Received request to fetch product catalog");

        return ResponseEntity.ok(productService.getViewProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> fetchProduct(@PathVariable String id) {

        log.info("Received request to fetch product with id {}", id);

        return ResponseEntity.ok(productService.getProduct(id));
    }

    @DeleteMapping("/{pid}/variant/{vid}")
    public ResponseEntity<?> deleteVariant(@PathVariable String pid,
                                           @PathVariable String vid) {

        log.info("Received request to delete variant {} from product {}", vid, pid);

        return ResponseEntity.ok(productService.deleteProductVariant(pid, vid));
    }
    
    @PatchMapping("/{pid}/variant/{vid}/restore")
    public ResponseEntity<?> restoreProductVariant(@PathVariable String pid,
                                                   @PathVariable String vid) {

        log.info("Received request to restore variant {} of product {}", vid, pid);

        return ResponseEntity.ok(productService.restoreProductVariant(pid, vid));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable String id,
                                           @RequestBody @Valid ProductUpdateRequest prod) {

        log.info("Received request to update product with id {}", id);

        return ResponseEntity.ok(productService.updateProduct(id, prod));
    }

    @PutMapping("/{pid}/variant/{vid}")
    public ResponseEntity<?> updateProductVariant(@PathVariable String pid,
                                                  @PathVariable String vid,
                                                  @RequestBody @Valid ProductVariantRequest var) {

        log.info("Received request to update variant {} of product {}", vid, pid);

        return ResponseEntity.ok(productService.updateProductVariant(pid, vid, var));
    }

    @GetMapping("/category/{catId}")
    public ResponseEntity<?> fetchProductsByCategory(@PathVariable String catId) {

        log.info("Received request to fetch products by category {}", catId);

        return ResponseEntity.ok(productService.getProductsByCategory(catId));
    }

    @GetMapping("/brand/{brandId}")
    public ResponseEntity<?> fetchProductsByBrand(@PathVariable String brandId) {

        log.info("Received request to fetch products by brand {}", brandId);

        return ResponseEntity.ok(productService.getProductsByBrand(brandId));
    }

    @GetMapping("/subCategory/{subCatId}")
    public ResponseEntity<?> fetchProductsBySubCat(@PathVariable String subCatId) {

        log.info("Received request to fetch products by subcategory {}", subCatId);

        return ResponseEntity.ok(productService.getProductsBySubCat(subCatId));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getProductStats() {

        log.info("Received request to fetch product statistics");

        return ResponseEntity.ok(productService.getProductStats());
    }
}



 