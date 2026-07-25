package com.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entities.Orders;

public interface OrderRepository extends JpaRepository<Orders, Long> {

}
