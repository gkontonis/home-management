package com.homemanagement.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * Detailed DTO for user information including metadata.
 * Used for displaying comprehensive user information in admin interfaces.
 */
@Data
public class UserDetailDto {
    private Long id;
    private String username;
    private String email;
    private Set<String> roles;
    private LocalDateTime createdAt;
    private Integer todoCount;
}
