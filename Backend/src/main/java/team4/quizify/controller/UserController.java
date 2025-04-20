package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import team4.quizify.entity.User;
import team4.quizify.service.CloudinaryService;
import team4.quizify.service.UserService;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/Quizify/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private CloudinaryService cloudinaryService;
    
    // Customize user profile - Only change bio, password, fname, lname, profile
    @PutMapping("/customizeProfile/{username}")
    public ResponseEntity<?> customizeProfile(
            @PathVariable String username,
            @RequestParam(value = "fname", required = false) String fname,
            @RequestParam(value = "lname", required = false) String lname,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        
        try {
            // First check if the user exists
            Optional<User> existingUserOpt = userService.getUserByUsername(username);
            if (existingUserOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found with username: " + username));
            }
            
            User existingUser = existingUserOpt.get();
            
            // Create user object with updated fields, keeping existing values if new ones aren't provided
            User updatedUserData = new User();
            updatedUserData.setFname(fname != null ? fname : existingUser.getFname());
            updatedUserData.setLname(lname != null ? lname : existingUser.getLname());
            updatedUserData.setUsername(username); // Keep the same username
            updatedUserData.setPassword(password); // If null, handled in service
            updatedUserData.setEmail(existingUser.getEmail()); // Email cannot be changed with this endpoint
            updatedUserData.setRole(existingUser.getRole()); // Role cannot be changed with this endpoint
            updatedUserData.setBio(bio != null ? bio : existingUser.getBio());    
            
            // Handle profile image 
            try {
                if (profileImage != null && !profileImage.isEmpty()) {
                    // Upload new image and set the URL
                    String profileImageUrl = cloudinaryService.uploadFile(profileImage);
                    updatedUserData.setProfileImageUrl(profileImageUrl);
                } else {
                    // Explicitly keep the existing profile image URL (not null)
                    updatedUserData.setProfileImageUrl(existingUser.getProfileImageUrl());
                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Failed to process profile image: " + e.getMessage()));
            }
            
            // Update the user
            Optional<User> updatedUser = userService.updateUserByUsername(username, updatedUserData);
            
            if (updatedUser.isPresent()) {
                return ResponseEntity.ok(updatedUser.get());
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Failed to update user"));
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update user: " + e.getMessage()));
        }
    }
    
    // Get user profile by username
    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getUserProfile(@PathVariable String username) {
        return userService.getUserByUsername(username)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .<User>body(null));
    }
}
