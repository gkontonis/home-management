package com.homemanagement.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.homemanagement.domain.Todo;
import lombok.Data;

import java.time.LocalDate;
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
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}