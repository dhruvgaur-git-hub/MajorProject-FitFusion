package com.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.backend.entites.mongo.Category;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
}
