package team4.quizify.patterns.factory;

import org.springframework.web.multipart.MultipartFile;
import team4.quizify.entity.User;

/**
 * Interface for User Factory
 * Defines common operations for all user factories
 */
public interface UserFactory {
    User createUser(String fname, String lname, String username, String password, 
                   String email, MultipartFile profileImage);
}
