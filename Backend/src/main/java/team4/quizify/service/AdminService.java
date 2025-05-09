package team4.quizify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import team4.quizify.entity.User;


@Service
public class AdminService {

    @Autowired
    private UserService userService;
    
    @Autowired
    private CloudinaryService cloudinaryService;
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private TeacherService teacherService;

    public User addUser(String fname, String lname, String username, String password, 
                        String email, String role, MultipartFile profileImage) {
        
        if (userService.isUsernameExists(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        if (userService.isEmailExists(email)) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        String profileImageUrl = null;
        if (profileImage != null && !profileImage.isEmpty()) {
            profileImageUrl = cloudinaryService.uploadFile(profileImage);
        }
        
        User user = new User(fname, lname, username, password, email, role, profileImageUrl);
        return userService.saveUser(user);
    }
      @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public void removeUser(Integer userId) {
        // First check if the user exists
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        try {
            // Delete any chat records associated with the user first
            jdbcTemplate.update("DELETE FROM chat WHERE sender_id = ? OR receiver_id = ?", userId, userId);
            
            // Delete associated student record if user is a student
            if ("Student".equals(user.getRole())) {
                studentService.deleteByUserId(userId);
            }
            
            // Delete associated teacher record if user is a teacher
            if ("Teacher".equals(user.getRole())) {
                teacherService.deleteByUserId(userId);
            }
            
            // Delete the user
            userService.deleteUser(userId);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting user: " + e.getMessage(), e);
        }
    }
    
    public User editUser(Integer userId, String fname, String lname, String username, 
                         String password, String email, String role, MultipartFile profileImage) {
        
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        if (username != null && !username.equals(user.getUsername()) && userService.isUsernameExists(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        if (email != null && !email.equals(user.getEmail()) && userService.isEmailExists(email)) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        if (fname != null) user.setFname(fname);
        if (lname != null) user.setLname(lname);
        if (username != null) user.setUsername(username);
        if (password != null) user.setPassword(password);
        if (email != null) user.setEmail(email);
        if (role != null) user.setRole(role);
        
        if (profileImage != null && !profileImage.isEmpty()) {
            String profileImageUrl = cloudinaryService.uploadFile(profileImage);
            user.setProfileImageUrl(profileImageUrl);
        }
        
        return userService.saveUser(user);
    }
}
