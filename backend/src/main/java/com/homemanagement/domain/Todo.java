package com.homemanagement.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "todos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private TodoStatus status = TodoStatus.PENDING;

    @Enumerated(EnumType.STRING)
    private TodoCategory category;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User assignedTo;

    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum TodoStatus {
        PENDING, IN_PROGRESS, COMPLETED
    }

    public enum TodoCategory {
        HOUSEHOLD, MAINTENANCE, GARDEN, CLEANING, OTHER
    }
}