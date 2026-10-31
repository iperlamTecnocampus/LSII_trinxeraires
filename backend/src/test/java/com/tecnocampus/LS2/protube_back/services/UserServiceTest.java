package com.tecnocampus.LS2.protube_back.services;

import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.persistance.CommentRepository;
import com.tecnocampus.LS2.protube_back.persistance.UserRepository;
import com.tecnocampus.LS2.protube_back.persistance.VideoRepository;
import com.tecnocampus.LS2.protube_back.services.DTO.in.CreateUserDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.UserDTO;
import com.tecnocampus.LS2.protube_back.services.exceptions.UserAlreadyExistsException;
import com.tecnocampus.LS2.protube_back.services.exceptions.UserNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

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

    @InjectMocks
    private UserService userService;

    @Nested
    @DisplayName("Pruebas para el método createUser")
    class CreateUserTests {

        @Test
        @DisplayName("Debe crear un usuario correctamente si los datos son válidos")
        void createUserSuccess() {
            // Arrange
            CreateUserDTO dto = new CreateUserDTO(
                    "johndoe",
                    "John Doe",
                    "Description",
                    "john@example.com",
                    "pic123"
            );
            User savedUser = new User("johndoe", "john@example.com");

            when(userRepository.existsById("johndoe")).thenReturn(false);
            when(userRepository.save(any(User.class))).thenReturn(savedUser);

            // Act
            UserDTO result = userService.createUser(dto);

            // Assert
            assertNotNull(result);
            assertEquals("johndoe", result.userName());
            assertEquals("john@example.com", result.email());
            verify(userRepository, times(1)).save(any(User.class));
        }

        @Test
        @DisplayName("Debe lanzar IllegalArgumentException si faltan datos requeridos")
        void createUserInvalidData() {
            // Arrange
            CreateUserDTO invalidDto = new CreateUserDTO(
                    "",
                    "John Doe",
                    "Description",
                    "john@example.com",
                    "pic123"
            );

            // Act & Assert
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                    userService.createUser(invalidDto)
            );

            assertEquals("username and email are required", exception.getMessage());
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Debe lanzar UserAlreadyExistsException si el usuario ya existe")
        void createUserAlreadyExists() {
            // Arrange
            CreateUserDTO dto = new CreateUserDTO(
                    "johndoe",
                    "John Doe",
                    "Description",
                    "john@example.com",
                    "pic123"
            );
            when(userRepository.existsById("johndoe")).thenReturn(true);

            // Act & Assert
            UserAlreadyExistsException exception = assertThrows(UserAlreadyExistsException.class, () ->
                    userService.createUser(dto)
            );

            assertEquals("User already exists", exception.getMessage());
            verify(userRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Pruebas para el método getUser")
    class GetUserTests {

        @Test
        @DisplayName("Debe devolver UserDTO si el usuario existe")
        void getUserSuccess() {
            // Arrange
            String username = "johndoe";
            User user = new User(username, "john@example.com");
            when(userRepository.findById(username)).thenReturn(Optional.of(user));

            // Act
            UserDTO result = userService.getUser(username);

            // Assert
            assertNotNull(result);
            assertEquals(username, result.userName());
            assertEquals("john@example.com", result.email());
        }

        @Test
        @DisplayName("Debe lanzar UserNotFoundException si el usuario no existe")
        void getUserNotFound() {
            // Arrange
            String username = "nonexistent";
            when(userRepository.findById(username)).thenReturn(Optional.empty());

            // Act & Assert
            UserNotFoundException exception = assertThrows(UserNotFoundException.class, () ->
                    userService.getUser(username)
            );

            assertEquals("User not found", exception.getMessage());
        }
    }

    @Nested
    @DisplayName("Pruebas para el método subscribeToUser")
    class SubscribeToUserTests {

        @Test
        @DisplayName("Debe establecer la suscripción bidireccional y guardar ambos usuarios")
        void subscribeToUserSuccess() {
            // Arrange
            String subscriberUsername = "alice";
            String subscribedUsername = "bob";

            User subscriber = new User(subscriberUsername, "alice@example.com");
            User subscribed = new User(subscribedUsername, "bob@example.com");

            when(userRepository.findById(subscriberUsername)).thenReturn(Optional.of(subscriber));
            when(userRepository.findById(subscribedUsername)).thenReturn(Optional.of(subscribed));
            when(userRepository.isSubscribed(subscriberUsername, subscribedUsername)).thenReturn(true);

            // Act
            boolean result = userService.subscribeToUser(subscriberUsername, subscribedUsername);

            // Assert
            assertTrue(result);
            assertTrue(subscriber.getSubscribedTo().contains(subscribed));
            assertTrue(subscribed.getSubscribers().contains(subscriber));

            verify(userRepository, times(1)).save(subscriber);
            verify(userRepository, times(1)).save(subscribed);
        }

        @Test
        @DisplayName("Debe lanzar excepción si el usuario suscriptor no existe")
        void subscriberNotFound() {
            // Arrange
            String subscriberUsername = "nonexistent";
            String subscribedUsername = "bob";

            when(userRepository.findById(subscriberUsername)).thenReturn(Optional.empty());

            // Act & Assert
            UserNotFoundException exception = assertThrows(UserNotFoundException.class, () ->
                    userService.subscribeToUser(subscriberUsername, subscribedUsername)
            );

            assertEquals("Subscriber user not found", exception.getMessage());
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Debe lanzar excepción si el usuario al que suscribirse no existe")
        void subscribedUserNotFound() {
            // Arrange
            String subscriberUsername = "alice";
            String subscribedUsername = "nonexistent";

            User subscriber = new User(subscriberUsername, "alice@example.com");

            when(userRepository.findById(subscriberUsername)).thenReturn(Optional.of(subscriber));
            when(userRepository.findById(subscribedUsername)).thenReturn(Optional.empty());

            // Act & Assert
            UserNotFoundException exception = assertThrows(UserNotFoundException.class, () ->
                    userService.subscribeToUser(subscriberUsername, subscribedUsername)
            );

            assertEquals("Subscribed user not found", exception.getMessage());
            verify(userRepository, never()).save(any());
        }
    }
}