package com.tecnocampus.LS2.protube_back.services;

import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.persistance.CommentRepository;
import com.tecnocampus.LS2.protube_back.persistance.UserRepository;
import com.tecnocampus.LS2.protube_back.persistance.VideoRepository;
import com.tecnocampus.LS2.protube_back.services.DTO.in.CreateUserDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.UserDTO;
import com.tecnocampus.LS2.protube_back.services.exceptions.UserAlreadyExistsException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private VideoRepository videoRepository;

    @Mock
    private CommentRepository commentRepository;

    private UserService userService;

    private String username;
    private String email;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository, videoRepository, commentRepository);
        username = "john_doe";
        email = "john.doe@example.com";
    }

    // =========================================================================
    // METHOD: createUser
    // =========================================================================
    @Nested
    @DisplayName("Tests para createUser en UserService")
    class CreateUserServiceTests {

        @Test
        @DisplayName("Debe crear y devolver el UserDTO cuando los datos son válidos")
        void createUser_Success() {
            CreateUserDTO dto = new CreateUserDTO(
                    username,
                    "John Doe",
                    "Descripción de prueba",
                    email,
                    "pic_fid_123"
            );

            when(userRepository.existsById(username)).thenReturn(false);
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            UserDTO result = userService.createUser(dto);

            assertNotNull(result);
            assertEquals(username, result.userName());
            assertEquals("John Doe", result.displayName());
            assertEquals(email, result.email());

            verify(userRepository, times(1)).existsById(username);
            verify(userRepository, times(1)).save(any(User.class));
        }

        @Test
        @DisplayName("Debe lanzar UserAlreadyExistsException cuando el username ya está registrado")
        void createUser_AlreadyExists_ThrowsException() {
            CreateUserDTO dto = new CreateUserDTO(
                    username,
                    "John Doe",
                    "Descripción de prueba",
                    email,
                    "pic_fid_123"
            );

            when(userRepository.existsById(username)).thenReturn(true);

            UserAlreadyExistsException exception = assertThrows(
                    UserAlreadyExistsException.class,
                    () -> userService.createUser(dto)
            );

            assertEquals("User already exists", exception.getMessage());
            verify(userRepository, times(1)).existsById(username);
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Debe lanzar IllegalArgumentException cuando el DTO es nulo o faltan campos obligatorios")
        void createUser_InvalidData_ThrowsIllegalArgumentException() {
            CreateUserDTO blankUsernameDto = new CreateUserDTO("   ", "John Doe", "Desc", email, "pic_1");
            CreateUserDTO nullUsernameDto = new CreateUserDTO(null, "John Doe", "Desc", email, "pic_1");
            CreateUserDTO blankEmailDto = new CreateUserDTO(username, "John Doe", "Desc", "  ", "pic_1");
            CreateUserDTO nullEmailDto = new CreateUserDTO(username, "John Doe", "Desc", null, "pic_1");

            assertThrows(IllegalArgumentException.class, () -> userService.createUser(null));
            assertThrows(IllegalArgumentException.class, () -> userService.createUser(blankUsernameDto));
            assertThrows(IllegalArgumentException.class, () -> userService.createUser(nullUsernameDto));
            assertThrows(IllegalArgumentException.class, () -> userService.createUser(blankEmailDto));
            assertThrows(IllegalArgumentException.class, () -> userService.createUser(nullEmailDto));

            verifyNoInteractions(userRepository);
        }
    }
}