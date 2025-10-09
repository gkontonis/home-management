package com.homemanagement.dto;

import com.homemanagement.domain.Todo;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TodoDto {
    private Long id;
    private String title;
    private String description;
    private Todo.TodoStatus status;
    private Todo.TodoCategory category;
    private Long assignedToId;
    private String assignedToUsername;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}