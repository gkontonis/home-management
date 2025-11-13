package com.homemanagement.rest.service;

import com.homemanagement.domain.User;
import com.homemanagement.dto.CreateUserRequest;
import com.homemanagement.dto.UpdateUserRequest;
import com.homemanagement.dto.UserDetailDto;
import com.homemanagement.dto.UserDto;
import com.homemanagement.exception.ResourceNotFoundException;
import com.homemanagement.mapper.UserMapper;
import com.homemanagement.rest.repository.TodoRepository;
import com.homemanagement.rest.repository.UserRepository;
import com.homemanagement.security.RoleConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service for managing users in the system.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TodoRepository todoRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get all users as basic DTOs.
     */
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Get assignable users for todo assignment.
     * Admin users see all users, regular users see only themselves.
     *
     * @param username The username of the requesting user
     * @return List of assignable users
     */
    public List<UserDto> getAssignableUsers(String username) {
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        // Check if user is admin
        boolean isAdmin = currentUser.getRoles().contains(RoleConstants.ADMIN);

        if (isAdmin) {
            // Admins can assign to anyone
            return getAllUsers();
        } else {
            // Regular users can only assign to themselves
            return List.of(userMapper.toDto(currentUser));
        }
    }

    /**
     * Get all users with detailed information including todo counts.
     */
    public List<UserDetailDto> getAllUsersDetailed() {
        return userRepository.findAll().stream()
                .map(user -> {
                    UserDetailDto dto = userMapper.toDetailDto(user);
                    dto.setTodoCount(todoRepository.findByAssignedToUsername(user.getUsername()).size());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Get a single user by ID.
     */
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toDto(user);
    }

    /**
     * Get detailed user information by ID.
     */
    public UserDetailDto getUserDetailById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        UserDetailDto dto = userMapper.toDetailDto(user);
        dto.setTodoCount(todoRepository.findByAssignedToUsername(user.getUsername()).size());
        return dto;
    }

    /**
     * Create a new user.
     */
    @Transactional
    public UserDto createUser(CreateUserRequest request) {
        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists: " + request.getUsername());
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Set roles - default to USER if not specified
        if (request.getRoles() == null || request.getRoles().isEmpty()) {
            user.setRoles(Set.of(RoleConstants.USER));
        } else {
            user.setRoles(new HashSet<>(request.getRoles()));
        }

        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }

    /**
     * Update an existing user.
     */
    @Transactional
    public UserDto updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getRoles() != null) {
            user.setRoles(new HashSet<>(request.getRoles()));
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toDto(updatedUser);
    }

    /**
     * Delete a user.
     */
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    /**
     * Reset a user's password (admin function).
     */
    @Transactional
    public void resetUserPassword(Long id, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /**
     * Check if a username is available.
     */
    public boolean isUsernameAvailable(String username) {
        return userRepository.findByUsername(username).isEmpty();
    }
}
