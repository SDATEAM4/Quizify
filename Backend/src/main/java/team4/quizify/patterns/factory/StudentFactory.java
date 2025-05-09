package team4.quizify.patterns.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import team4.quizify.entity.User;
import team4.quizify.entity.Student;
import team4.quizify.patterns.adapter.StorageManager;
import team4.quizify.repository.StudentRepository;
import team4.quizify.service.UserService;


@Component
public class StudentFactory implements UserFactory {

    @Autowired
    private UserService userService;
    
    @Autowired
    private StorageManager storageManager;
    
    @Autowired
    private StudentRepository studentRepository;

    @Override
    public User createUser(String fname, String lname, String username, String password, 
                          String email, MultipartFile profileImage) {
        // Check if username or email already exists
        if (userService.isUsernameExists(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        if (userService.isEmailExists(email)) {
            throw new IllegalArgumentException("Email already exists");
        }
          // Upload profile image if provided
        String profileImageUrl = null;
        if (profileImage != null && !profileImage.isEmpty()) {
            profileImageUrl = storageManager.uploadFile(profileImage);
        }
        
        // Create the user with role Student
        User user = new User(fname, lname, username, password, email, "Student", profileImageUrl);
        User savedUser = userService.saveUser(user);
        
        // Create and associate student record
        Student student = new Student();
        student.setUser(savedUser);
        student.setEnrolledSubjects(new Integer[0]); // Empty array at start
        student.setAttemptedQuiz(new Integer[0]); // Empty array at start
        studentRepository.save(student);
        
        return savedUser;
    }
}
