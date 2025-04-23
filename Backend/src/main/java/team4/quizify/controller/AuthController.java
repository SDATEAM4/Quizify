package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team4.quizify.entity.User;
import team4.quizify.service.AuthService;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam(required = false) String username,
                                   @RequestParam(required = false) String email,
                                   @RequestParam String password) {
        Optional<User> userOptional = username != null ?
                authService.loginWithUsername(username, password) :
                authService.loginWithEmail(email, password);

        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PostMapping("/forgot-password/email")
    public ResponseEntity<?> sendOtp(@RequestParam String email) {
        boolean sent = authService.sendOtpToEmail(email);
        return sent ? ResponseEntity.ok("OTP sent to email") :
                ResponseEntity.status(404).body("Email not found");
    }

    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam Long userId, @RequestParam String otp) {
        boolean valid = authService.verifyOtp(userId, otp);
        return valid ? ResponseEntity.ok("OTP verified") :
                ResponseEntity.status(400).body("Invalid OTP");
    }

    @PutMapping("/forgot-password/send-otp")
    public ResponseEntity<?> resetPassword(@RequestParam String email, @RequestParam String newPassword) {
        boolean reset = authService.resetPassword(email, newPassword);
        return reset ? ResponseEntity.ok("Password reset successfully") :
                ResponseEntity.status(404).body("User not found");
    }
}
