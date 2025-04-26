package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team4.quizify.entity.User;
import team4.quizify.service.AuthService;

import java.util.Optional;

@RestController
@RequestMapping("/Quizify")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam(required = false) String username,
                                   @RequestParam(required = false) String email,
                                   @RequestParam String password) {
        try {
            Optional<User> userOptional = username != null ?
                    authService.loginWithUsername(username, password) :
                    authService.loginWithEmail(email, password);

            if (userOptional.isPresent()) {
                return ResponseEntity.ok(userOptional.get());
            } else {
                return ResponseEntity.status(401).body("Invalid credentials");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal Server Error");
        }
    }

    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<?> sendOtp(@RequestParam String email) {
        try {
            boolean sent = authService.sendOtpToEmail(email);
            return sent ? ResponseEntity.ok("OTP sent to email") :
                    ResponseEntity.status(404).body("Email not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal Server Error");
        }
    }

    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam int userId, @RequestParam String otp) {
        try {
            boolean valid = authService.verifyOtp(userId, otp);
            return valid ? ResponseEntity.ok("OTP verified") :
                    ResponseEntity.status(400).body("Invalid OTP");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal Server Error");
        }
    }

    @PutMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPassword(@RequestParam String email, @RequestParam String newPassword) {
        try {
            boolean reset = authService.resetPassword(email, newPassword);
            return reset ? ResponseEntity.ok("Password reset successfully") :
                    ResponseEntity.status(404).body("User not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal Server Error");
        }
    }

    // Catches any wrong URL / wrong HTTP method
    @ExceptionHandler({Exception.class})
    public ResponseEntity<String> handleAnyException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Internal Server Error");
    }
}
