package com.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custom_exceptions.InvalidOperationException;
import com.backend.dtos.ExchangeDto;
import com.backend.entities.Exchanges;
import com.backend.entities.Exchanges.ExchangeStatus;
import com.backend.entities.ReturnRequests;
import com.backend.entities.ReturnRequests.ReturnRequestStatus;
import com.backend.repositories.ExchangeRepository;
import com.backend.repositories.ReturnRequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ExchangeServiceImpl implements ExchangeService {

	private final ExchangeRepository exchangeRepo;
	private final ReturnRequestRepository returnRequestRepo;

	@Override
	public String createExchange(ExchangeDto request) {
		String mssg = "Exchange Creation Failed !!";
			ReturnRequests returnRequest = returnRequestRepo.findByReturnRequestId(request.getReturnRequestId());

			if (returnRequest == null) {
				throw new InvalidOperationException("Invalid Return Request Id!!");
			}

			if (exchangeRepo.findByReturnRequest_ReturnRequestId(request.getReturnRequestId()) != null) {
				throw new InvalidOperationException("Exchange already exists for this return request!!");
			}

			Exchanges exchange = new Exchanges();
			exchange.setReturnRequest(returnRequest);
			exchange.setNewVariantId(request.getNewVariantId());
			exchange.setStatus(ExchangeStatus.PENDING);

			exchangeRepo.save(exchange);

			mssg = "Exchange created successfully with ID: " + exchange.getExchangeId();
		return mssg;
	}

	@Override
	public Exchanges getExchangeByReturnRequestId(Long returnRequestId) {
		Exchanges exchange = exchangeRepo.findByReturnRequest_ReturnRequestId(returnRequestId);

		if (exchange == null) {
			throw new InvalidOperationException("No exchange found for returnRequestId: " + returnRequestId);
		}

		return exchange;
	}

	@Override
	public String updateExchangeStatus(Long exchangeId, ExchangeStatus status) {
		String mssg = "Exchange Status Update Failed !!";
			Exchanges exchange = exchangeRepo.findByExchangeId(exchangeId);
			if (exchange == null) {
				throw new InvalidOperationException("Invalid Exchange Id!!");
			}
			exchange.setStatus(status);
			exchangeRepo.save(exchange);

			if (status == ExchangeStatus.PROCESSED) {
				ReturnRequests returnRequest = exchange.getReturnRequest();
				returnRequest.setStatus(ReturnRequestStatus.COMPLETED);
				returnRequestRepo.save(returnRequest);
			}
			mssg = "Exchange Status Updated to " + status + " Successfully!!";		
		return mssg;
	}

}