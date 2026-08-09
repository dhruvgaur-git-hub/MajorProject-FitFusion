package com.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.backend.entites.mongo.Product;
import com.backend.entites.mongo.ProductStatus;

public interface ProductRepositoryCustomInt {
    Page<Product> findProductsDynamic(Long retailerId, String categoryId, String subCategoryId, String brandId, ProductStatus status, Pageable pageable);
}