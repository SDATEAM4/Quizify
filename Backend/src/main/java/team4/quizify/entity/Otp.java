package team4.quizify.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Otp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // or GenerationType.AUTO
    @Column(name = "otp_id")
    private Integer otpId;
    @Column(name = "user_id")
    private int userId;

    @Column(name = "otp_code")
    private String otpCode;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Integer getOtpId() {
        return otpId;
    }

    public void setOtpId(Integer otpId) {
        this.otpId = otpId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getOtpCode() {
        return otpCode;
    }

    public void setOtpCode(String otpCode) {
        this.otpCode = otpCode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
