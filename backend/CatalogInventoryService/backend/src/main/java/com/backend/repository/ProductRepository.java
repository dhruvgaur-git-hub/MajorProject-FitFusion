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

	/* long countByActiveTrue(); */

	long countByStatus(ProductStatus approved);

	@Query("{" +
	           "  ?#{ [0] == null ? { $expr: true } : { 'status': [0] } }," +
	           "  ?#{ [1] == null ? { $expr: true } : { 'categoryId': [1] } }," +
	           "  ?#{ [2] == null ? { $expr: true } : { 'subCategoryId': [2] } }," +
	           "  ?#{ [3] == null ? { $expr: true } : { 'brandId': [3] } }" +
	           "}")
	List<Product> findProductsDynamic(
			ProductStatus status, 
	        String categoryId, 
	        String subCategoryId, 
	        String brandId
	        );
}
