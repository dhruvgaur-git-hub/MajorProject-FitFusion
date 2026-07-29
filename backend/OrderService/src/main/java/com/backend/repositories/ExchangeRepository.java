package com.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entities.Exchanges;

public interface ExchangeRepository extends JpaRepository<Exchanges, Long> {

	Exchanges findByReturnRequest_ReturnRequestId(Long returnRequestId);

	Exchanges findByExchangeId(Long exchangeId);

}