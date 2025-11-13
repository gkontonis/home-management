package com.homemanagement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

/**
 * DTO for updating an existing user.
 * Used by administrators to modify user details.
 */
@Data
public class UpdateUserRequest {

    @Email(message = "Email must be valid")
    private String email;

    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    private Set<String> roles;
}
