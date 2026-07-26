package com.fitfusion.userservice.repositories;

import com.fitfusion.userservice.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Useful for authentication or user checks if needed later
    Optional<User> findByEmail(String email);
}