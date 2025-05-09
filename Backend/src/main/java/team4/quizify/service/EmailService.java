package team4.quizify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public void sendOtp(String toEmail, String otp) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        
        helper.setFrom(senderEmail);
        helper.setTo(toEmail);
        helper.setSubject("Your OTP Code - Quizify");
        
        String htmlContent = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">                <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h1 style="color: #333333; text-align: center; margin-bottom: 30px;">🎓 Quizify</h1>
                    <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                        👋 Hello,<br><br>
                        You have requested an OTP for password recovery. Please use the following code to verify your identity:
                    </p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333333;">🔐 %s</span>
                    </div>
                    <p style="color: #666666; font-size: 14px; margin-top: 20px;">
                        ⏰ This OTP will expire in 5 minutes. If you didn't request this code, please ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
                    <p style="color: #999999; font-size: 12px; text-align: center;">
                        © 2025 Quizify Learning System. All rights reserved.
                    </p>
                </div>
            </div>
        """.formatted(otp);
        
        helper.setText(htmlContent, true);
        mailSender.send(mimeMessage);
    }
}
