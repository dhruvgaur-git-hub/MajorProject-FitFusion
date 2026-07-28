package com.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.backend.entites.mongo.SubCategory;

@Repository
public interface SubCategoryRepository extends MongoRepository<SubCategory, String> {

	List<SubCategory> findByCategoryId(String catId);

	long countByActiveTrue();
}
