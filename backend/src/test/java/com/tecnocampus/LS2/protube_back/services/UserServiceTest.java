package com.tecnocampus.LS2.protube_back.services;

import com.tecnocampus.LS2.protube_back.model.Comment;
import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.model.Video;
import com.tecnocampus.LS2.protube_back.persistance.UserRepository;
import com.tecnocampus.LS2.protube_back.persistance.VideoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private VideoRepository videoRepository;

    @InjectMocks
    private UserService userService;

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

            // Act
            userService.subscribeToUser(subscriberUsername, subscribedUsername);

            // Assert
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
            RuntimeException exception = assertThrows(RuntimeException.class, () ->
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
            RuntimeException exception = assertThrows(RuntimeException.class, () ->
                    userService.subscribeToUser(subscriberUsername, subscribedUsername)
            );

            assertEquals("Subscribed user not found", exception.getMessage());
            verify(userRepository, never()).save(any());
        }
    }
}