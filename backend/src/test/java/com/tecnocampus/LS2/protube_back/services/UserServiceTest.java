package com.tecnocampus.LS2.protube_back.services;

import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.model.Video;
import com.tecnocampus.LS2.protube_back.persistence.CommentRepository;
import com.tecnocampus.LS2.protube_back.persistence.UserRepository;
import com.tecnocampus.LS2.protube_back.persistence.VideoRepository;
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
import com.tecnocampus.LS2.protube_back.services.DTO.in.EditUserDTO;
import com.tecnocampus.LS2.protube_back.services.exceptions.UserNotFoundException;
import java.util.Optional;
import java.util.List;
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

    @Test
    @DisplayName("getUser returns videos and subscriptions loaded from their repositories")
    void getUserIncludesVideosAndSubscriptions() {
        User user = new User(username, email);
        user.setDisplayName("John Doe");
        User subscribedUser = new User("channel", "channel@example.com");
        subscribedUser.setDisplayName("Channel");
        Video video = new Video("Test video", "Description", user);

        when(userRepository.findById(username)).thenReturn(Optional.of(user));
        when(videoRepository.findByAuthorUsername(username)).thenReturn(List.of(video));
        when(userRepository.findSubscriptionsByUsername(username)).thenReturn(List.of(subscribedUser));

        UserDTO result = userService.getUser(username);

        assertEquals(1, result.videos().size());
        assertEquals("Test video", result.videos().get(0).title());
        assertEquals(1, result.subscribedTo().size());
        assertEquals("channel", result.subscribedTo().get(0).userName());
        verify(videoRepository).findByAuthorUsername(username);
        verify(userRepository).findSubscriptionsByUsername(username);
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
                    , "banner_fid_456"
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
                    "pic_fid_123",
                    "banner_fid_456"
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
            CreateUserDTO blankUsernameDto = new CreateUserDTO("   ", "John Doe", "Desc", email, "pic_1", "banner_1");
            CreateUserDTO nullUsernameDto = new CreateUserDTO(null, "John Doe", "Desc", email, "pic_1", "banner_1");
            CreateUserDTO blankEmailDto = new CreateUserDTO(username, "John Doe", "Desc", "  ", "pic_1", "banner_1");
            CreateUserDTO nullEmailDto = new CreateUserDTO(username, "John Doe", "Desc", null, "pic_1", "banner_1");

            assertThrows(IllegalArgumentException.class, () -> userService.createUser(null));
            assertThrows(IllegalArgumentException.class, () -> userService.createUser(blankUsernameDto));
            assertThrows(IllegalArgumentException.class, () -> userService.createUser(nullUsernameDto));
            assertThrows(IllegalArgumentException.class, () -> userService.createUser(blankEmailDto));
            assertThrows(IllegalArgumentException.class, () -> userService.createUser(nullEmailDto));

            verifyNoInteractions(userRepository);
        }
    }
    // =========================================================================
    // METHOD: editUserProfile
    // =========================================================================
    @Nested
    @DisplayName("Tests para editUserProfile en UserService")
    class EditUserProfileTests {

        @Test
        @DisplayName("Debe actualizar y devolver el UserDTO cuando los datos son válidos")
        void editUserProfile_Success() {
            // Arrange
            EditUserDTO dto = new EditUserDTO(
                    "Nou Display Name",
                    "Nova descripció",
                    "new_pic_fid",
                    "new_banner_fid"
            );

            User existingUser = new User(username, email);
            existingUser.setDisplayName("Old Name");

            when(userRepository.findById(username)).thenReturn(Optional.of(existingUser));
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            UserDTO result = userService.editUserProfile(username, dto);

            // Assert
            assertNotNull(result);
            assertEquals("Nou Display Name", existingUser.getDisplayName());
            assertEquals("Nova descripció", existingUser.getDescription());
            assertEquals("new_pic_fid", existingUser.getPictureFid());
            assertEquals("new_banner_fid", existingUser.getBannerFid());

            verify(userRepository, times(1)).findById(username);
            verify(userRepository, times(1)).save(existingUser);
        }

        @Test
        @DisplayName("Debe ignorar campos nulos del DTO y actualizar solo los proporcionados (Partial Update)")
        void editUserProfile_PartialUpdate_Success() {
            // Arrange
            // Solo pasamos la descripción, el resto nulo
            EditUserDTO dto = new EditUserDTO(null, "Solo actualizo la descripción", null, null);

            User existingUser = new User(username, email);
            existingUser.setDisplayName("Nom Original");
            existingUser.setPictureFid("old_pic_fid");

            when(userRepository.findById(username)).thenReturn(Optional.of(existingUser));
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            userService.editUserProfile(username, dto);

            // Assert
            assertEquals("Nom Original", existingUser.getDisplayName()); // No ha de canviar
            assertEquals("old_pic_fid", existingUser.getPictureFid()); // No ha de canviar
            assertEquals("Solo actualizo la descripción", existingUser.getDescription()); // S'ha d'actualitzar

            verify(userRepository, times(1)).save(existingUser);
        }

        @Test
        @DisplayName("Debe lanzar UserNotFoundException cuando el usuario no existe en la base de datos")
        void editUserProfile_UserNotFound_ThrowsException() {
            // Arrange
            EditUserDTO dto = new EditUserDTO("Nom", "Desc", "pic", "banner");
            when(userRepository.findById(username)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(UserNotFoundException.class, () -> userService.editUserProfile(username, dto));

            verify(userRepository, times(1)).findById(username);
            verify(userRepository, never()).save(any(User.class));
        }
    }
}
