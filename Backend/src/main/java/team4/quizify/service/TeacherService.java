package team4.quizify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import team4.quizify.entity.Teacher;
import team4.quizify.entity.User;
import team4.quizify.repository.TeacherRepository;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CloudinaryService cloudinaryService;
    
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
    
    public Teacher getTeacherByTeacherId(Integer teacherId) {
        return teacherRepository.findById(teacherId).orElse(null);
    }
    
    public Teacher getTeacherByUserId(Integer userId) {
        return teacherRepository.findByUser_UserId(userId);
    }
    
    public Teacher updateTeacher(Teacher teacher) {
        return teacherRepository.save(teacher);
    }    public void deleteByUserId(Integer userId) {
        Teacher teacher = teacherRepository.findByUser_UserId(userId);
        if (teacher != null) {
            teacherRepository.delete(teacher);
        }
    }
    
    public Teacher removeSubjectTaught(Integer teacherId, Integer subjectId) {
        Teacher teacher = getTeacherByTeacherId(teacherId);
        if (teacher == null) {
            return null;
        }
        
        // Get current subjects taught
        Integer[] currentSubjects = teacher.getSubjectTaught();
        if (currentSubjects == null || currentSubjects.length == 0) {
            return teacher; // No subjects to remove
        }
        
        // Filter out the subject ID to be removed
        List<Integer> updatedSubjects = Arrays.stream(currentSubjects)
            .filter(subject -> !subject.equals(subjectId))
            .collect(Collectors.toList());
        
        // Update the teacher entity with the new subjects array
        teacher.setSubjectTaught(updatedSubjects.toArray(new Integer[0]));
        
        // Save and return the updated teacher
        return teacherRepository.save(teacher);
    }
}
