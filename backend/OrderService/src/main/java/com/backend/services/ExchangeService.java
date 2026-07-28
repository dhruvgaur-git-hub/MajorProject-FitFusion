package com.backend.services;

import com.backend.dtos.ExchangeDto;
import com.backend.entities.Exchanges;
import com.backend.entities.Exchanges.ExchangeStatus;

public interface ExchangeService {

	String createExchange(ExchangeDto request);

	Exchanges getExchangeByReturnRequestId(Long returnRequestId);

	String updateExchangeStatus(Long exchangeId, ExchangeStatus status);

}