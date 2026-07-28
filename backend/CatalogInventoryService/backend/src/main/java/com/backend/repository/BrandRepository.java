package com.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.backend.entites.mongo.Brand;

@Repository
public interface BrandRepository extends MongoRepository<Brand, String> {

	boolean existsByCode(String code);

	long countByActiveTrue();

}
