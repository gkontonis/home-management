package com.homemanagement.rest.controller;

import com.homemanagement.dto.CreateUserRequest;
import com.homemanagement.dto.TodoDto;
import com.homemanagement.dto.UpdateUserRequest;
import com.homemanagement.dto.UserDetailDto;
import com.homemanagement.dto.UserDto;
import com.homemanagement.domain.User;
import com.homemanagement.rest.repository.UserRepository;
import com.homemanagement.rest.service.TodoService;
import com.homemanagement.rest.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for user management operations.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final TodoService todoService;

    /**
     * Get all users (admin only).
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDetailDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsersDetailed());
    }

    /**
     * Get assignable users for todo assignment.
     * Regular users see only themselves, admins see all users.
     * This endpoint is accessible to all authenticated users.
     */
    @GetMapping("/assignable")
    public ResponseEntity<List<UserDto>> getAssignableUsers(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(userService.getAssignableUsers(username));
    }

    /**
     * Get a specific user by ID (admin only).
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDetailDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserDetailById(id));
    }

    /**
     * Create a new user (admin only).
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDto created = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Update an existing user (admin only).
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    /**
     * Delete a user (admin only).
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get todos for a specific user (admin only).
     */
    @GetMapping("/{id}/todos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TodoDto>> getUserTodos(@PathVariable Long id) {
        // First get the user to ensure they exist
        UserDetailDto user = userService.getUserDetailById(id);
        // Then get their todos by username
        return ResponseEntity.ok(todoService.getTodosByUsername(user.getUsername()));
    }

    /**
     * Reset a user's password (admin only).
     */
    @PutMapping("/{id}/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> resetUserPassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String newPassword = payload.get("newPassword");

        if (newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "New password is required"));
        }

        if (newPassword.length() < 8) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Password must be at least 8 characters"));
        }

        userService.resetUserPassword(id, newPassword);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }

    /**
     * Check if a username is available (admin only, for validation during user creation).
     */
    @GetMapping("/check-username")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> checkUsername(@RequestParam String username) {
        boolean available = userService.isUsernameAvailable(username);
        return ResponseEntity.ok(Map.of("available", available));
    }

    /**
     * Update own password (any authenticated user).
     */
    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(
            @RequestBody Map<String, String> passwordData,
            Authentication authentication) {

        String oldPassword = passwordData.get("oldPassword");
        String newPassword = passwordData.get("newPassword");

        if (oldPassword == null || oldPassword.isBlank() ||
                newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Old password and new password are required"));
        }

        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "New password must be at least 6 characters"));
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify old password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Current password is incorrect"));
        }

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
}