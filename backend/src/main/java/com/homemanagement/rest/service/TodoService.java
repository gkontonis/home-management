package com.homemanagement.rest.service;

import com.homemanagement.domain.Todo;
import com.homemanagement.domain.User;
import com.homemanagement.dto.TodoDto;
import com.homemanagement.exception.ResourceNotFoundException;
import com.homemanagement.mapper.TodoMapper;
import com.homemanagement.rest.repository.TodoRepository;
import com.homemanagement.rest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;
    private final TodoMapper todoMapper;

    public List<TodoDto> getAllTodos() {
        return todoRepository.findAll().stream()
            .map(todoMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<TodoDto> getTodosByUsername(String username) {
        return todoRepository.findByAssignedToUsername(username).stream()
            .map(todoMapper::toDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public TodoDto createTodo(TodoDto todoDto) {
        User user = userRepository.findById(todoDto.getAssignedToId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Todo todo = todoMapper.toEntity(todoDto);
        todo.setAssignedTo(user);
        return todoMapper.toDto(todoRepository.save(todo));
    }

    @Transactional
    public TodoDto updateTodo(Long id, TodoDto todoDto) {
        Todo existingTodo = todoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Todo not found"));

        existingTodo.setTitle(todoDto.getTitle());
        existingTodo.setDescription(todoDto.getDescription());
        existingTodo.setStatus(todoDto.getStatus());
        existingTodo.setCategory(todoDto.getCategory());
        existingTodo.setDueDate(todoDto.getDueDate());

        if (todoDto.getStatus() == Todo.TodoStatus.COMPLETED && existingTodo.getCompletedAt() == null) {
            existingTodo.setCompletedAt(LocalDateTime.now());
        }

        return todoMapper.toDto(todoRepository.save(existingTodo));
    }

    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }
}