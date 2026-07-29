package com.fitfusion.userservice.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.fitfusion.userservice.dtos.ChangePasswordRequestDto;
import com.fitfusion.userservice.dtos.CustomerRegisterRequestDto;
import com.fitfusion.userservice.dtos.LoginRequestDto;
import com.fitfusion.userservice.dtos.LoginResponseDto;
import com.fitfusion.userservice.dtos.RetailerRegisterRequestDto;
import com.fitfusion.userservice.dtos.UpdateUserRequestDto;
import com.fitfusion.userservice.dtos.UserResponseDto;
import com.fitfusion.userservice.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
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
    public ResponseEntity<LoginResponseDto> login(
            @RequestBody LoginRequestDto req) {

        return ResponseEntity.ok(userService.login(req));
    }

    // Get Profile
	/*
	 * @GetMapping("/profile/{email}") public ResponseEntity<UserResponseDto>
	 * getProfile(
	 * 
	 * @PathVariable String email) {
	 * 
	 * return ResponseEntity.ok(userService.getProfile(email)); }
	 */
    //This was before jwt based auth
    
    
    @GetMapping("/profile")
    public ResponseEntity<UserResponseDto> getProfile(@AuthenticationPrincipal UserDetails userDetails){
    	return ResponseEntity.status(HttpStatus.OK).body(userService.getProfile(userDetails.getUsername()));
    }
    
    
    
	/*
	 * // Update Profile
	 * 
	 * @PutMapping("/{email}") public ResponseEntity<UserResponseDto> updateUser(
	 * 
	 * @PathVariable String email,
	 * 
	 * @RequestBody UpdateUserRequestDto req) {
	 * 
	 * return ResponseEntity.ok(userService.updateUser(email, req)); }
	 */
    @PutMapping("/editprofile")
    public ResponseEntity<UserResponseDto> updateUser(@AuthenticationPrincipal UserDetails userDetails, @RequestBody UpdateUserRequestDto req){
    	return ResponseEntity.ok(userService.updateUser(userDetails.getUsername(),req));
    }

	/*
	 * // Change Password
	 * 
	 * @PutMapping("/{email}/change-password") public ResponseEntity<String>
	 * changePassword(
	 * 
	 * @PathVariable String email,
	 * 
	 * @RequestBody ChangePasswordRequestDto req) {
	 * 
	 * userService.changePassword(email, req); return
	 * ResponseEntity.ok("Password changed successfully"); }
	 */
    
    @PutMapping("/changepassword")
    public ResponseEntity<String> changePassword(@AuthenticationPrincipal UserDetails userDetail, @RequestBody ChangePasswordRequestDto req){
    	userService.changePassword(userDetail.getUsername(), req);
    	return ResponseEntity.ok("Password Changed Successfully!");
    }

	/*
	 * // Delete User
	 * 
	 * @DeleteMapping("/{email}") public ResponseEntity<String> deleteUser(
	 * 
	 * @PathVariable String email) {
	 * 
	 * userService.deleteUser(email); return
	 * ResponseEntity.ok("User deleted successfully"); }
	 */
    
    @DeleteMapping
    public ResponseEntity<String> deleteUser(@AuthenticationPrincipal UserDetails userDetails){
    	userService.deleteUser(userDetails.getUsername());
    	return ResponseEntity.ok("User Deleted Successfully!");
    }
}
