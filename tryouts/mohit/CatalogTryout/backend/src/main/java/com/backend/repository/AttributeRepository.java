package com.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.backend.entites.mongo.AttributeDefinition;

public interface AttributeRepository extends MongoRepository<AttributeDefinition, String>{

}
