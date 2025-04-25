package team4.quizify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import team4.quizify.entity.Otp;

import java.time.LocalDateTime;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findByUserIdAndOtpCode(int userId, String otpCode);
    void deleteByCreatedAtBefore(LocalDateTime time);

}

