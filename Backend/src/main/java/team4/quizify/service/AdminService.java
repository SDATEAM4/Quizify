package team4.quizify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import team4.quizify.entity.User;
import team4.quizify.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private UserService userService;
    
    @Autowired
    private CloudinaryService cloudinaryService;
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private TeacherService teacherService;

    public User addUser(String fname, String lname, String username, String password, 
                        String email, String role, MultipartFile profileImage) {
        
        // Check if username or email already exists
        if (userService.isUsernameExists(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        if (userService.isEmailExists(email)) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        // Upload profile image to Cloudinary if provided
        String profileImageUrl = null;
        if (profileImage != null && !profileImage.isEmpty()) {
            profileImageUrl = cloudinaryService.uploadFile(profileImage);
        }
        
        // Create and save the new user
        User newUser = new User(fname, lname, username, password, email, role, profileImageUrl);
        return userService.saveUser(newUser);
    }
      public void removeUser(Long userId) {
        // First check if the user exists
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        // Delete associated student record if user is a student
        if ("Student".equals(user.getRole())) {
            studentService.deleteByUserId(userId);
        }
        
        // Delete associated teacher record if user is a teacher
        if ("Teacher".equals(user.getRole())) {
            teacherService.deleteByUserId(userId);
        }
        
        // Delete the user
        userService.deleteUser(userId);
    }
    
    public User editUser(Long userId, String fname, String lname, String username, 
                         String password, String email, String role, MultipartFile profileImage) {
        
        User existingUser = userService.getUserById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        // Check if username is being changed and is already taken by another user
        if (!existingUser.getUsername().equals(username) && userService.isUsernameExists(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        // Check if email is being changed and is already taken by another user
        if (!existingUser.getEmail().equals(email) && userService.isEmailExists(email)) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        // Update user details
        existingUser.setFname(fname);
        existingUser.setLname(lname);
        existingUser.setUsername(username);
        
        // Only update password if a new one is provided
        if (password != null && !password.isEmpty()) {
            existingUser.setPassword(password);
        }
        
        existingUser.setEmail(email);
        existingUser.setRole(role);
        
        // Upload and update profile image if provided
        if (profileImage != null && !profileImage.isEmpty()) {
            String profileImageUrl = cloudinaryService.uploadFile(profileImage);
            existingUser.setProfileImageUrl(profileImageUrl);
        }
        
        return userService.saveUser(existingUser);
    }
}
