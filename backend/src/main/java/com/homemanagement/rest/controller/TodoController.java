package com.homemanagement.rest.controller;

import com.homemanagement.dto.TodoDto;
import com.homemanagement.rest.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for todo management operations.
 */
@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    /**
     * Get all todos (admin only).
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TodoDto>> getAllTodos() {
        return ResponseEntity.ok(todoService.getAllTodos());
    }

    /**
     * Get todos for the authenticated user.
     */
    @GetMapping("/my")
    public ResponseEntity<List<TodoDto>> getMyTodos(Authentication authentication) {
        return ResponseEntity.ok(todoService.getTodosByUsername(authentication.getName()));
    }

    /**
     * Create a new todo.
     */
    @PostMapping
    public ResponseEntity<TodoDto> createTodo(@RequestBody TodoDto todoDto, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(todoService.createTodo(todoDto, authentication.getName()));
    }

    /**
     * Update an existing todo.
     * Users can only update their own todos unless they are admin.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TodoDto> updateTodo(
            @PathVariable Long id,
            @RequestBody TodoDto todoDto,
            Authentication authentication) {
        return ResponseEntity.ok(todoService.updateTodo(id, todoDto, authentication.getName()));
    }

    /**
     * Delete a todo.
     * Users can only delete their own todos unless they are admin.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id, Authentication authentication) {
        todoService.deleteTodo(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}