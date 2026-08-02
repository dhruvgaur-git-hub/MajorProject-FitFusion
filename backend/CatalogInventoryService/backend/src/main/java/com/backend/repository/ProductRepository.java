package com.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.backend.entites.mongo.Product;
import com.backend.entites.mongo.ProductStatus;

public interface ProductRepository extends MongoRepository<Product, String> {

	List<Product> findAllByStatus(ProductStatus pending);

	boolean existsByProductCode(String productCode);

	List<Product> findAllByStatusAndCategoryId(ProductStatus approved, String catId);

	List<Product> findAllByStatusAndBrandId(ProductStatus approved, String brandId);

	List<Product> findAllByStatusAndSubCategoryId(ProductStatus approved, String subCatId);

	long countByStatus(ProductStatus approved);

	boolean existsByName(String name);

}