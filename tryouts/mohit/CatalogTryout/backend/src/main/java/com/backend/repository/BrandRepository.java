package com.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.backend.entites.mongo.Brand;

public interface BrandRepository extends MongoRepository<Brand, String> {

}
