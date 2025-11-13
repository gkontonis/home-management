package com.homemanagement.mapper;

import com.homemanagement.domain.User;
import com.homemanagement.dto.CreateUserRequest;
import com.homemanagement.dto.UserDetailDto;
import com.homemanagement.dto.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * MapStruct mapper for User entity and its DTOs.
 */
@Mapper(componentModel = "spring")
public interface UserMapper {

    /**
     * Map User entity to UserDto.
     */
    UserDto toDto(User user);

    /**
     * Map User entity to UserDetailDto.
     */
    @Mapping(target = "todoCount", ignore = true)
    UserDetailDto toDetailDto(User user);

    /**
     * Map CreateUserRequest to User entity.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "password", ignore = true)
    User toEntity(CreateUserRequest request);
}
