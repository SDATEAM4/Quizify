package team4.quizify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team4.quizify.entity.User;
import team4.quizify.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Integer id) {
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

    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }
    
    public boolean deleteUserByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            userRepository.delete(user.get());
            return true;
        }
        return false;    }
    
    public Optional<User> updateUserByUsername(String username, User updatedUser) {
        return userRepository.findByUsername(username)
            .map(existingUser -> {
                if (updatedUser.getFname() != null) existingUser.setFname(updatedUser.getFname());
                if (updatedUser.getLname() != null) existingUser.setLname(updatedUser.getLname());
                if (updatedUser.getPassword() != null) existingUser.setPassword(updatedUser.getPassword());
                if (updatedUser.getBio() != null) existingUser.setBio(updatedUser.getBio());
                if (updatedUser.getProfileImageUrl() != null) existingUser.setProfileImageUrl(updatedUser.getProfileImageUrl());
                return userRepository.save(existingUser);
            });
    }
}
