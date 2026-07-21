package com.fitfusion.customer.services;
import com.fitfusion.customer.dtos.*;
public interface CustomerService {

    CustomerResponseDto signup(SignUpRequestDto request);

    String login(LoginRequestDto request);

    CustomerResponseDto getProfile(String customerEmail);

    CustomerResponseDto updateProfile(String customerEmail,
                                   UpdateCustomerRequestDto request);

    void changePassword(String customerEmail,
                        ChangePasswordRequestDto request);
}