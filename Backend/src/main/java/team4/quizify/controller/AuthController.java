package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team4.quizify.entity.User;
import team4.quizify.patterns.singleton.AuthServiceSingleton;
import team4.quizify.service.AuthService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/Quizify")
public class AuthController {

    @Autowired
    private ApplicationContext applicationContext;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam(required = false) String username,
                                   @RequestParam(required = false) String email,
                                   @RequestParam String password) {
        try {
            // Validate input parameters
            if (username == null && email == null) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Username or email is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            // Use the singleton instance of AuthService
            AuthServiceSingleton authServiceSingleton = AuthServiceSingleton.getInstance(applicationContext);
            AuthService authService = authServiceSingleton.getAuthService();
            
            Optional<User> userOptional = username != null ?
                    authService.loginWithUsername(username, password) :
                    authService.loginWithEmail(email, password);            if (userOptional.isPresent()) {
                // Return success message, not user details
                Map<String, String> response = new HashMap<>();
                response.put("message", "User logged in");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Error,Try again");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "An unexpected error occurred");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<?> sendOtp(@RequestParam String email) {
        try {
            if (email == null || email.trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Email is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            // Use the singleton instance of AuthService
            AuthServiceSingleton authServiceSingleton = AuthServiceSingleton.getInstance(applicationContext);
            AuthService authService = authServiceSingleton.getAuthService();
            
            boolean sent = authService.sendOtpToEmail(email);
            
            Map<String, String> response = new HashMap<>();
            if (sent) {
                response.put("message", "OTP sent to email");
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "User not found with the provided email");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "An unexpected error occurred");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam int userId, @RequestParam String otp) {
        try {
            if (otp == null || otp.trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "OTP is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            // Use the singleton instance of AuthService
            AuthServiceSingleton authServiceSingleton = AuthServiceSingleton.getInstance(applicationContext);
            AuthService authService = authServiceSingleton.getAuthService();
            
            boolean valid = authService.verifyOtp(userId, otp);
            
            Map<String, String> response = new HashMap<>();
            if (valid) {
                response.put("message", "OTP verified successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Invalid or expired OTP");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "An unexpected error occurred");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PutMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPassword(@RequestParam String email, @RequestParam String newPassword) {
        try {
            // Validate input parameters
            if (email == null || email.trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Email is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            if (newPassword == null || newPassword.trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "New password is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            // Use the singleton instance of AuthService
            AuthServiceSingleton authServiceSingleton = AuthServiceSingleton.getInstance(applicationContext);
            AuthService authService = authServiceSingleton.getAuthService();
            
            boolean reset = authService.resetPassword(email, newPassword);
            
            Map<String, String> response = new HashMap<>();
            if (reset) {
                response.put("message", "Password reset successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "User not found with the provided email");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "An unexpected error occurred");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
      @ExceptionHandler({Exception.class})
    public ResponseEntity<?> handleAnyException(Exception e) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "An unexpected error occurred");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
