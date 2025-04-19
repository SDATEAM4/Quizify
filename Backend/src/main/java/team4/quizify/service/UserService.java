package team4.quizify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team4.quizify.entity.User;
import team4.quizify.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

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
    
    public Optional<User> updateUserByUsername(String username, User updatedUser) {
        Optional<User> existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            
            // Update user properties
            user.setFname(updatedUser.getFname());
            user.setLname(updatedUser.getLname());
            // Don't update username as we're finding by username
            
            // Only update password if it's not null or empty
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                user.setPassword(updatedUser.getPassword());
            }
            
            user.setEmail(updatedUser.getEmail());
            user.setRole(updatedUser.getRole());
            
            // Only update profile image URL if it's not null
            if (updatedUser.getProfileImageUrl() != null) {
                user.setProfileImageUrl(updatedUser.getProfileImageUrl());
            }
            
            return Optional.of(userRepository.save(user));
        }
        return Optional.empty();
    }
}
