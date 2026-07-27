package com.backend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.backend.entites.mongo.AttributeDefinition;

public interface AttributeRepository extends MongoRepository<AttributeDefinition, String>{

	Optional<AttributeDefinition> findBySubCategoryId(String subCategoryId);

	
}
