package com.homemanagement.mapper;

import org.mapstruct.Mapper;
import com.homemanagement.domain.Todo;
import com.homemanagement.dto.TodoDto;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Mapper(componentModel = "spring")
public interface TodoMapper {
  Todo toEntity(TodoDto dto);
  TodoDto toDto(Todo entity);

  // Help MapStruct convert between LocalDate and LocalDateTime
  default LocalDateTime map(LocalDate date) {
    return date != null ? date.atStartOfDay() : null;
  }
  default LocalDate map(LocalDateTime dateTime) {
    return dateTime != null ? dateTime.toLocalDate() : null;
  }
}