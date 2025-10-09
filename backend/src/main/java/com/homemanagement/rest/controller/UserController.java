package com.homemanagement.rest.controller;

import com.homemanagement.dto.UserDto;
import com.homemanagement.domain.User;
import com.homemanagement.rest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
            .map(this::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

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

    private UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRoles(user.getRoles());
        return dto;
    }
}