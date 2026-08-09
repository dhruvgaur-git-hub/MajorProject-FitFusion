package com.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.util.StringUtils;

import com.backend.entites.mongo.Product;
import com.backend.entites.mongo.ProductStatus;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ProductRepositoryImpl implements ProductRepositoryCustomInt{
	
	 private final MongoTemplate mongoTemplate;

	@Override
	public Page<Product> findProductsDynamic(Long retailerId, String categoryId, String subCategoryId, String brandId,
			ProductStatus status, Pageable pageable) {
		
		Query query = new Query();
		
		if (retailerId != null) {
			query.addCriteria(Criteria.where("createdByRetailerId").is(retailerId));
		}
		
		if (status != null) {
	        query.addCriteria(Criteria.where("status").is(status));
	    } else if (retailerId == null) {
	        query.addCriteria(Criteria.where("status").is(ProductStatus.APPROVED));
	    }


		if (StringUtils.hasText(categoryId)) {
            query.addCriteria(Criteria.where("categoryId").is(categoryId));
        }
		
		if (StringUtils.hasText(subCategoryId)) {
            query.addCriteria(Criteria.where("subCategoryId").is(subCategoryId));
        }

        if (StringUtils.hasText(brandId)) {
            query.addCriteria(Criteria.where("brandId").is(brandId));
        }

        long total = mongoTemplate.count(query, Product.class);
        query.with(pageable);
        List<Product> products = mongoTemplate.find(query, Product.class);

        return new PageImpl<>(products, pageable, total);
    }

}
