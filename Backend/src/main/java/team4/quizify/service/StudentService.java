package team4.quizify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import team4.quizify.entity.Student;
import team4.quizify.entity.User;
import team4.quizify.repository.StudentRepository;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CloudinaryService cloudinaryService;
    
    public Student addStudent(String fname, String lname, String username, String password, 
                        String email, Integer[] enrolledSubjects, MultipartFile profileImage) {
        // First create the user with role "student"
        if (userService.isUsernameExists(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        if (userService.isEmailExists(email)) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        // Upload profile image to Cloudinary if provided
        String profileImageUrl = null;
        if (profileImage != null && !profileImage.isEmpty()) {
            profileImageUrl = cloudinaryService.uploadFile(profileImage);
        }
        
        // Create and save the new user
        User newUser = new User(fname, lname, username, password, email, "student", profileImageUrl);
        User savedUser = userService.saveUser(newUser);
        
        // Create and save the student record
        Student student = new Student();
        student.setUser(savedUser);
        student.setEnrolledSubjects(enrolledSubjects);
        student.setAttemptedQuiz(new Integer[0]); // Empty array at start
        
        return studentRepository.save(student);
    }
    
    public Student getStudentByStudentId(Integer studentId) {
        return studentRepository.findById(studentId).orElse(null);
    }
    
    public Student getStudentByUserId(Integer userId) {
        return studentRepository.findByUser_UserId(userId);
    }
    
    public Student updateStudent(Student student) {
        return studentRepository.save(student);
    }
    
    public void deleteByUserId(Integer userId) {
        Student student = studentRepository.findByUser_UserId(userId);
        if (student != null) {
            studentRepository.delete(student);
        }
    }
}
