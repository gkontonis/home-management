package com.homemanagement.rest.service;

import com.homemanagement.domain.Todo;
import com.homemanagement.domain.User;
import com.homemanagement.dto.TodoDto;
import com.homemanagement.exception.ResourceNotFoundException;
import com.homemanagement.mapper.TodoMapper;
import com.homemanagement.rest.repository.TodoRepository;
import com.homemanagement.rest.repository.UserRepository;
import com.homemanagement.security.RoleConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing todos with role-based authorization.
 */
@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;
    private final TodoMapper todoMapper;

    /**
     * Get all todos (admin only, enforced at controller level).
     */
    public List<TodoDto> getAllTodos() {
        return todoRepository.findAll().stream()
                .map(todoMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Get todos for a specific user.
     */
    public List<TodoDto> getTodosByUsername(String username) {
        return todoRepository.findByAssignedToUsername(username).stream()
                .map(todoMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Create a new todo.
     * Admins can create todos for any user.
     * Regular users can only create todos for themselves.
     */
    @Transactional
    public TodoDto createTodo(TodoDto todoDto, String currentUsername) {
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        User assignedUser = userRepository.findById(todoDto.getAssignedToId())
                .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));

        // Non-admin users can only create todos for themselves
        if (!isAdmin(currentUser) && !assignedUser.getUsername().equals(currentUsername)) {
            throw new AccessDeniedException("You can only create todos for yourself");
        }

        Todo todo = todoMapper.toEntity(todoDto);
        todo.setAssignedTo(assignedUser);
        return todoMapper.toDto(todoRepository.save(todo));
    }

    /**
     * Update an existing todo.
     * Admins can update any todo.
     * Regular users can only update their own todos.
     */
    @Transactional
    public TodoDto updateTodo(Long id, TodoDto todoDto, String currentUsername) {
        Todo existingTodo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found"));

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        // Check ownership unless user is admin
        if (!isAdmin(currentUser) && !existingTodo.getAssignedTo().getUsername().equals(currentUsername)) {
            throw new AccessDeniedException("You can only update your own todos");
        }

        existingTodo.setTitle(todoDto.getTitle());
        existingTodo.setDescription(todoDto.getDescription());
        existingTodo.setStatus(todoDto.getStatus());
        existingTodo.setCategory(todoDto.getCategory());
        existingTodo.setDueDate(todoDto.getDueDate());

        if (todoDto.getStatus() == Todo.TodoStatus.COMPLETED && existingTodo.getCompletedAt() == null) {
            existingTodo.setCompletedAt(LocalDateTime.now());
        } else if (todoDto.getStatus() != Todo.TodoStatus.COMPLETED) {
            existingTodo.setCompletedAt(null);
        }

        return todoMapper.toDto(todoRepository.save(existingTodo));
    }

    /**
     * Delete a todo.
     * Admins can delete any todo.
     * Regular users can only delete their own todos.
     */
    @Transactional
    public void deleteTodo(Long id, String currentUsername) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found"));

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        // Check ownership unless user is admin
        if (!isAdmin(currentUser) && !todo.getAssignedTo().getUsername().equals(currentUsername)) {
            throw new AccessDeniedException("You can only delete your own todos");
        }

        todoRepository.deleteById(id);
    }

    /**
     * Check if a user has admin role.
     */
    private boolean isAdmin(User user) {
        return user.getRoles().contains(RoleConstants.ADMIN);
    }
}