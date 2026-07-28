package com.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.backend.entites.mongo.Inventory;

public interface InventoryRepository extends MongoRepository<Inventory, String>{

	boolean existsByVariantIdAndRetailerId(String variantId, String retailerId);

	List<Inventory> findByVariantIdAndActiveTrue(String variantId);

}
