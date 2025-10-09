package com.homemanagement.mapper;

import com.homemanagement.domain.Todo;
import com.homemanagement.dto.TodoDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TodoMapper {
    
    @Mapping(source = "assignedTo.id", target = "assignedToId")
    @Mapping(source = "assignedTo.username", target = "assignedToUsername")
    TodoDto toDto(Todo todo);

    @Mapping(target = "assignedTo", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "completedAt", ignore = true)
    Todo toEntity(TodoDto todoDto);
}