package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import team4.quizify.entity.User;
import team4.quizify.service.CloudinaryService;
import team4.quizify.service.UserService;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/Quizify/user")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private CloudinaryService cloudinaryService;
    
    // Get user by ID
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Integer userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }
    }
    
    // Get user by username
    @GetMapping("/username/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userService.getUserByUsername(username);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }
    }
    
    private boolean isValidImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && (
            contentType.equals("image/jpeg") ||
            contentType.equals("image/png") ||
            contentType.equals("image/jpg") ||
            contentType.equals("image/webp")
        );
    }

    @PutMapping(value = "customizeProfile/{userId}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> updateUser(
            @PathVariable Integer userId,
            @RequestParam(required = false) String fname,
            @RequestParam(required = false) String lname,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String password,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String bio,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        try {
            Optional<User> existingUser = userService.getUserById(userId);
            if (existingUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }
            
            User user = existingUser.get();
            
            // Update fields if provided
            if (fname != null) user.setFname(fname);
            if (lname != null) user.setLname(lname);
            if (username != null && !username.equals(user.getUsername())) {
                if (userService.isUsernameExists(username)) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error", "Username already exists"));
                }
                user.setUsername(username);
            }
            if (password != null) user.setPassword(password);
            if (email != null && !email.equals(user.getEmail())) {
                if (userService.isEmailExists(email)) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error", "Email already exists"));
                }
                user.setEmail(email);
            }
            if (bio != null) user.setBio(bio);
            
            // Handle profile image upload with validation
            if (profileImage != null && !profileImage.isEmpty()) {
                if (!isValidImageFile(profileImage)) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error", "Invalid file type. Only JPEG, PNG, and WebP images are allowed."));
                }
              String imageUrl = cloudinaryService.uploadFile(profileImage);
               user.setProfileImageUrl(imageUrl);
            }
            
           userService.saveUser(user);
            return ResponseEntity.ok(Map.of("message", "User profile updated successfully"));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update user profile", "details", e.getMessage()));
        }
    }
}