package team4.quizify.patterns.template;

import org.springframework.web.multipart.MultipartFile;
import team4.quizify.entity.User;


public abstract class UserCreationTemplate {
    
   
    public final User createUser(String fname, String lname, String username, String password, 
                              String email, String role, MultipartFile profileImage) {
        
        // Validate user data
        validateUserData(username, email);
        
        // Process profile image
        String profileImageUrl = processProfileImage(profileImage);
        
        // Create base user
        User user = createBaseUser(fname, lname, username, password, email, role, profileImageUrl);
        
        // Create role-specific user
        return createRoleSpecificUser(user);
    }
    
    // Common step for all user types - validation
    protected abstract void validateUserData(String username, String email);
    
    // Common step for all user types - profile image processing
    protected abstract String processProfileImage(MultipartFile profileImage);
    
    // Common step for all user types - base user creation
    protected abstract User createBaseUser(String fname, String lname, String username, String password, 
                                     String email, String role, String profileImageUrl);
    
    // Step that varies based on user role
    protected abstract User createRoleSpecificUser(User user);
}
