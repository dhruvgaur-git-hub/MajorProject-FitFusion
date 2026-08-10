package com.backend.clients;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.backend.dtos.InvoiceRequestDto;
import com.backend.custom_exceptions.InvalidOperationException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class PrintInvoiceServiceClient {

    private final RestTemplate restTemplate;

    @Value("${service.invoice.base-url}")
    private String invoiceServiceBaseUrl;

    public byte[] generateInvoice(Long orderId, String jwtToken) {

        try {
            String url = invoiceServiceBaseUrl
                    + "/api/invoices/generate/"
                    + orderId;

            // jwtToken here is the full raw "Authorization" header value
            // (e.g. "Bearer eyJhbGc..."), forwarded as-is from the incoming
            // request — setBearerAuth() would prepend "Bearer " a second
            // time, so we set the header directly instead.
            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.AUTHORIZATION, jwtToken);

            HttpEntity<Void> requestEntity =
                    new HttpEntity<>(headers);

            ResponseEntity<byte[]> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    requestEntity,
                    byte[].class
            );

            return response.getBody();

        } catch (RestClientException e) {
            log.error("Failed to generate invoice", e);

            throw new InvalidOperationException(
                    "Unable to generate invoice. Print Invoice Service may be unavailable."
            );
        }
    }
}