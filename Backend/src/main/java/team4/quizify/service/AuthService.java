package team4.quizify.service;

import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import team4.quizify.entity.Otp;
import team4.quizify.entity.User;
import team4.quizify.repository.OtpRepository;
import team4.quizify.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private EmailService emailService;

    public Optional<User> loginWithUsername(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.filter(u -> u.getPassword().equals(password));
    }

    public Optional<User> loginWithEmail(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.filter(u -> u.getPassword().equals(password));
    }

    public boolean sendOtpToEmail(String email) {
        // Step 1: Find the user by email
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Step 2: Generate the OTP
            String otp = String.format("%06d", new Random().nextInt(999999));

            // Step 3: Create an OTP entity and map it to the userId
            Otp otpEntity = new Otp();
            otpEntity.setUserId(user.getUserId());
            otpEntity.setOtpCode(otp); // Set the generated OTP code

            // Step 4: Save the OTP entity to the database
            otpRepository.save(otpEntity);
            otpEntity.setCreatedAt(LocalDateTime.now());            // Step 5: Send OTP to the user's email
            try {
                emailService.sendOtp(email, otp);
                return true;  // OTP sent successfully
            } catch (MessagingException e) {
                e.printStackTrace();
                return false;  // Failed to send OTP
            }
        }


        return false;  // User not found
    }

    public boolean verifyOtp(int userId, String otpCode) {
        otpRepository.deleteByCreatedAtBefore(LocalDateTime.now().minusMinutes(5));
        Optional<Otp> otpOptional = otpRepository.findByUserIdAndOtpCode(userId, otpCode);
        if (otpOptional.isPresent()) {
            Otp otp = otpOptional.get();
            if (otp.getCreatedAt().isAfter(LocalDateTime.now().minusMinutes(5))) {
                return true;
            } else {
                otpRepository.delete(otp);  // Auto-delete expired OTP
            }
        }
        return false;
    }


    public boolean resetPassword(String email, String newPassword) {
        // Step 1: Find the user by email
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(newPassword);  // Set the new password
            userRepository.save(user);  // Save the updated user to the database
            return true;  // Password reset successful
        }
        return false;  // User not found
    }
    @Transactional
    @Scheduled(fixedRate = 60000)
    public void deleteExpiredOtps() {
        otpRepository.deleteByCreatedAtBefore(LocalDateTime.now().minusMinutes(5));
    }
}
