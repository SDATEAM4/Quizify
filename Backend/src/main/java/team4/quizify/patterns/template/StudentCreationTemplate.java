package team4.quizify.patterns.template;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import team4.quizify.entity.Student;
import team4.quizify.entity.User;
import team4.quizify.patterns.adapter.StorageManager;
import team4.quizify.repository.StudentRepository;
import team4.quizify.service.UserService;


@Component
public class StudentCreationTemplate extends UserCreationTemplate {

    @Autowired
    private UserService userService;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private StorageManager storageManager;

    @Override
    protected void validateUserData(String username, String email) {
        if (userService.isUsernameExists(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        if (userService.isEmailExists(email)) {
            throw new IllegalArgumentException("Email already exists");
        }
    }

    @Override
    protected String processProfileImage(MultipartFile profileImage) {
        if (profileImage != null && !profileImage.isEmpty()) {
            return storageManager.uploadFile(profileImage);
        }
        return null;
    }    @Override
    protected User createBaseUser(String fname, String lname, String username, String password, 
                             String email, String role, String profileImageUrl) {
        User user = new User(fname, lname, username, password, email, role, profileImageUrl);
        return userService.saveUser(user);
    }    @Override
    protected User createRoleSpecificUser(User user) {
        Student student = new Student();
        student.setUser(user);
        student.setEnrolledSubjects(new Integer[0]); // Empty array at start
        student.setAttemptedQuiz(new Integer[0]); // Empty array at start
        studentRepository.save(student);
        return user;
    }
}
