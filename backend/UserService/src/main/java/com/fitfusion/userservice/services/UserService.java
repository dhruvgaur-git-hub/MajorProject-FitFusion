package com.fitfusion.userservice.services;

import com.fitfusion.userservice.dtos.ChangePasswordRequestDto;
import com.fitfusion.userservice.dtos.CustomerRegisterRequestDto;
import com.fitfusion.userservice.dtos.LoginRequestDto;
import com.fitfusion.userservice.dtos.LoginResponseDto;
import com.fitfusion.userservice.dtos.RetailerRegisterRequestDto;
import com.fitfusion.userservice.dtos.UpdateUserRequestDto;
import com.fitfusion.userservice.dtos.UserResponseDto;

public interface UserService {

    UserResponseDto registerCustomer(CustomerRegisterRequestDto reqDto);

    UserResponseDto registerRetailer(RetailerRegisterRequestDto req);

    LoginResponseDto login(LoginRequestDto req);

    UserResponseDto getProfile(String userEmail);

    UserResponseDto updateUser(String userEmailId, UpdateUserRequestDto req);

    void changePassword(String userEmailId, ChangePasswordRequestDto req);

    void deleteUser(String email);
}
