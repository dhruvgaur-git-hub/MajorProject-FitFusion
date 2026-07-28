package com.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.backend.entites.mongo.Inventory;

public interface InventoryRepository extends MongoRepository<Inventory, String>{

}
