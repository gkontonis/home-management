package com.homemanagement.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.homemanagement.domain.Todo;
import com.homemanagement.dto.TodoDto;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Mapper(componentModel = "spring")
public interface TodoMapper {
  @Mapping(target = "assignedTo", ignore = true)
  Todo toEntity(TodoDto dto);

  @Mapping(target = "assignedToId", source = "assignedTo.id")
  @Mapping(target = "assignedToUsername", source = "assignedTo.username")
  TodoDto toDto(Todo entity);
}