package com.backend.services;

import java.util.List;

import org.springframework.stereotype.Component;

import com.backend.dtos.InvoiceItemDto;
import com.backend.dtos.InvoiceRequestDto;
import com.backend.dtos.ShippingAddressDto;
import com.backend.entities.OrderItems;
import com.backend.entities.Orders;
import com.backend.entities.ShippingAddress;

@Component
public class InvoiceMapper {

    public InvoiceRequestDto toInvoiceRequest(Orders order) {

        InvoiceRequestDto dto = new InvoiceRequestDto();

        dto.setOrderId(order.getOrderId());
        dto.setCustomerId(order.getCustomerId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setPaymentStatus(order.getPaymentStatus().name());
        dto.setCreatedAt(order.getCreatedAt());

        dto.setShippingAddress(toShippingAddressDto(order.getShippingAddress()));

        List<InvoiceItemDto> items = order.getOrderItems()
                .stream()
                .map(this::toInvoiceItemDto)
                .toList();

        dto.setItems(items);

        return dto;
    }

    private ShippingAddressDto toShippingAddressDto(ShippingAddress address) {

        if (address == null) {
            return null;
        }

        ShippingAddressDto dto = new ShippingAddressDto();

        dto.setName(address.getName());
        dto.setMobile(address.getMobile());
        dto.setAddressLine1(address.getAddressLine1());
        dto.setAddressLine2(address.getAddressLine2());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setCountry(address.getCountry());
        dto.setPincode(address.getPincode());

        if (address.getAddresstype() != null) {
            dto.setAddressType(address.getAddresstype().name());
        }

        return dto;
    }

    private InvoiceItemDto toInvoiceItemDto(OrderItems item) {

        InvoiceItemDto dto = new InvoiceItemDto();

        dto.setProductName(item.getProductName());
        dto.setSku(item.getSku());
        dto.setQuantity(item.getQuantity());
        dto.setMrp(item.getMrp());
        dto.setRetailerQuotedPrice(item.getRetailerQuotedPrice());
        dto.setCommissionPercent(item.getCommissionPercent());
        dto.setDiscountPercent(item.getDiscountPercent());
        dto.setSellingPrice(item.getSellingPrice());
        dto.setSubtotal(item.getSubtotal());

        return dto;
    }
}