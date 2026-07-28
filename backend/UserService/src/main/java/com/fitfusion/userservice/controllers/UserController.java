package com.fitfusion.userservice.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fitfusion.userservice.dtos.ChangePasswordRequestDto;
import com.fitfusion.userservice.dtos.CustomerRegisterRequestDto;
import com.fitfusion.userservice.dtos.LoginRequestDto;
import com.fitfusion.userservice.dtos.RetailerRegisterRequestDto;
import com.fitfusion.userservice.dtos.UpdateUserRequestDto;
import com.fitfusion.userservice.dtos.UserResponseDto;
import com.fitfusion.userservice.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Customer Registration
    @PostMapping("/register/customer")
    public ResponseEntity<UserResponseDto> registerCustomer(
            @RequestBody CustomerRegisterRequestDto req) {

        return new ResponseEntity<>(
                userService.registerCustomer(req),
                HttpStatus.CREATED);
    }

    // Retailer Registration
    @PostMapping("/register/retailer")
    public ResponseEntity<UserResponseDto> registerRetailer(
            @RequestBody RetailerRegisterRequestDto req) {

        return new ResponseEntity<>(
                userService.registerRetailer(req),
                HttpStatus.CREATED);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody LoginRequestDto req) {

        return ResponseEntity.ok(userService.login(req));
    }

    // Get Profile
    @GetMapping("/profile/{email}")
    public ResponseEntity<UserResponseDto> getProfile(
            @PathVariable String email) {

        return ResponseEntity.ok(userService.getProfile(email));
    }

    // Update Profile
    @PutMapping("/{email}")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable String email,
            @RequestBody UpdateUserRequestDto req) {

        return ResponseEntity.ok(userService.updateUser(email, req));
    }

    // Change Password
    @PutMapping("/{email}/change-password")
    public ResponseEntity<String> changePassword(
            @PathVariable String email,
            @RequestBody ChangePasswordRequestDto req) {

        userService.changePassword(email, req);
        return ResponseEntity.ok("Password changed successfully");
    }

    // Delete User
    @DeleteMapping("/{email}")
    public ResponseEntity<String> deleteUser(
            @PathVariable String email) {

        userService.deleteUser(email);
        return ResponseEntity.ok("User deleted successfully");
    }
}
