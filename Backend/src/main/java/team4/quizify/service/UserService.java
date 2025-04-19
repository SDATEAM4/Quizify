package team4.quizify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import team4.quizify.entity.User;
import team4.quizify.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public boolean isUsernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
      public boolean deleteUserByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            userRepository.deleteById(user.get().getId());
            return true;
        }
        return false;
    }   


    public boolean deleteUserWithCascade(Long userId) {
        // First check if the user exists
        if (!userRepository.existsById(userId)) {
            return false;
        }
        
        try {
            // Delete query records where this user is receiver or sender
            jdbcTemplate.update("DELETE FROM query WHERE sender_id = ? OR receiver_id = ?", userId, userId);
            
            // Delete chat messages related to this user (both as sender and receiver)
            jdbcTemplate.update("DELETE FROM chat WHERE sender_id = ? OR receiver_id = ?", userId, userId);
            
            // Delete any quiz attempts related to this user (if applicable)
            try {
                jdbcTemplate.update("DELETE FROM quiz_attempt WHERE user_id = ?", userId);
            } catch (Exception e) {
               
            }
            
            // Delete related teacher records if any
            jdbcTemplate.update("DELETE FROM teacher WHERE user_id = ?", userId);
            
            // Delete related student records if any
            jdbcTemplate.update("DELETE FROM student WHERE user_id = ?", userId);

            // Delete related quiz records if any
            jdbcTemplate.update("DELETE FROM report WHERE user_id = ?", userId);
            
            // Finally delete the user
            jdbcTemplate.update("DELETE FROM users WHERE id = ?", userId);
            
            return true;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting user with ID " + userId + ": " + e.getMessage(), e);
        }
    }      public Optional<User> updateUserByUsername(String username, User updatedUser) {
        Optional<User> existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            
            // Update user properties
            user.setFname(updatedUser.getFname());
            user.setLname(updatedUser.getLname());
            
            // Only update password if it's not null or empty
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                user.setPassword(updatedUser.getPassword());
            }
            
            user.setEmail(updatedUser.getEmail());
            user.setRole(updatedUser.getRole());
            // Update bio
            user.setBio(updatedUser.getBio());
            
            // Always update the profile image URL with whatever value was provided
            // This ensures if a new image was uploaded, the URL gets updated
            user.setProfileImageUrl(updatedUser.getProfileImageUrl());
            
            return Optional.of(userRepository.save(user));
        }
        return Optional.empty();
    }
}
