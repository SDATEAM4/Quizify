package team4.quizify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import team4.quizify.entity.Teacher;
import team4.quizify.entity.User;
import team4.quizify.repository.TeacherRepository;
import team4.quizify.repository.UserRepository;

import java.util.Optional;

@Service
public class TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CloudinaryService cloudinaryService;
    
    /**
     * Add a new teacher - creates a user first, then adds teacher record
     */
    public Teacher addTeacher(String fname, String lname, String username, String password, 
                        String email, Integer[] subjectTaught, MultipartFile profileImage) {
        
        // First create the user with role "teacher"
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
        User newUser = new User(fname, lname, username, password, email, "teacher", profileImageUrl);
        User savedUser = userService.saveUser(newUser);
        
        // Create and save the teacher record
        Teacher teacher = new Teacher();
        teacher.setUser(savedUser);
        teacher.setSubjectTaught(subjectTaught);
        teacher.setCreatedQuiz(new Integer[0]); // Empty array at start
        
        return teacherRepository.save(teacher);
    }
    
    public Teacher getTeacherByTeacherId(Long teacherId) {
        return teacherRepository.findById(teacherId).orElse(null);
    }
    
    public Teacher getTeacherByUserId(Long userId) {
        return teacherRepository.findByUserId(userId);
    }
    
    public Teacher updateTeacher(Teacher teacher) {
        return teacherRepository.save(teacher);
    }
    
    /**
     * Deletes a teacher record associated with the specified user ID
     * @param userId The ID of the user whose teacher record should be deleted
     */
    public void deleteByUserId(Long userId) {
        Teacher teacher = teacherRepository.findByUserId(userId);
        if (teacher != null) {
            teacherRepository.delete(teacher);
        }
    }
}
