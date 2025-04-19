package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import team4.quizify.entity.Student;
import team4.quizify.entity.Subject;
import team4.quizify.entity.Teacher;
import team4.quizify.entity.User;
import team4.quizify.service.AdminService;
import team4.quizify.service.CloudinaryService;
import team4.quizify.service.StudentService;
import team4.quizify.service.SubjectService;
import team4.quizify.service.TeacherService;
import team4.quizify.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/Quizify/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CloudinaryService cloudinaryService;
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private TeacherService teacherService;
    
    @Autowired
    private SubjectService subjectService;

    //GET ALL USERS
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    //GET USER BY ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        return userService.getUserById(userId)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
    
    //CHECK DUPLICATE USERNAME OR EMAIL
    @GetMapping("/check-duplicate")
    public ResponseEntity<?> isDuplicateValue(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email) {
        
        Map<String, Boolean> result = new HashMap<>();
        
        if (username != null && !username.isEmpty()) {
            result.put("usernameExists", userService.isUsernameExists(username));
        }
        
        if (email != null && !email.isEmpty()) {
            result.put("emailExists", userService.isEmailExists(email));
        }
        
        return ResponseEntity.ok(result);
    }
    
    //GET USER BY USERNAME
    @GetMapping("/user/username/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    //GET USER BY EMAIL
      @GetMapping("/user/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
    

    //GET STUDENT BY ID
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentById(@PathVariable Long studentId) {
        Student student = studentService.getStudentByStudentId(studentId);
        if (student != null) {
            return ResponseEntity.ok(student);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Student not found with id: " + studentId));
        }
    }
    
    //GET TEACHER BY ID
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getTeacherById(@PathVariable Long teacherId) {
        Teacher teacher = teacherService.getTeacherByTeacherId(teacherId);
        if (teacher != null) {
            return ResponseEntity.ok(teacher);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Teacher not found with id: " + teacherId));
        }
    }

     //UPDATE USER BY USERNAME - Only change bio, password, fname, lname, profile
      @PutMapping("/user/username/{username}")
    public ResponseEntity<?> updateUserByUsername(
            @PathVariable String username,
            @RequestParam(value = "fname", required = false) String fname,
            @RequestParam(value = "lname", required = false) String lname,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        
        try {
            // First check if the user exists
            Optional<User> existingUserOpt = userService.getUserByUsername(username);
            if (existingUserOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found with username: " + username));
            }
            
            User existingUser = existingUserOpt.get();
            
            // Create user object with updated fields, keeping existing values if new ones aren't provided
            User updatedUserData = new User();
            updatedUserData.setFname(fname != null ? fname : existingUser.getFname());
            updatedUserData.setLname(lname != null ? lname : existingUser.getLname());
            updatedUserData.setUsername(username); // Keep the same username
            updatedUserData.setPassword(password); // If null, handled in service
            updatedUserData.setEmail(existingUser.getEmail()); // Email cannot be changed with this endpoint
            updatedUserData.setRole(existingUser.getRole()); // Role cannot be changed with this endpoint
            updatedUserData.setBio(bio != null ? bio : existingUser.getBio());
            
            // Copy the existing profile image URL if no new image is provided
            if (profileImage != null && !profileImage.isEmpty()) {
                String profileImageUrl = cloudinaryService.uploadFile(profileImage);
                updatedUserData.setProfileImageUrl(profileImageUrl);
            } else {
                updatedUserData.setProfileImageUrl(existingUser.getProfileImageUrl());
            }
            
            // Update the user
            Optional<User> updatedUser = userService.updateUserByUsername(username, updatedUserData);
            
            if (updatedUser.isPresent()) {
                return ResponseEntity.ok(updatedUser.get());
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Failed to update user"));
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update user: " + e.getMessage()));
        }
    }

    // REGISTER NEW STUDENT USER WITH ENROLLED SUBJECTS - COMBINED ENDPOINT
    @PostMapping("/user/addStudent")
    public ResponseEntity<?> addStudentWithSubjects(
            @RequestParam("fname") String fname,
            @RequestParam("lname") String lname,
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestParam(value = "enrolledSubjects", required = false) String enrolledSubjectsStr) {
        
        try {
            // Create user with Student role
            User newUser = adminService.addUser(fname, lname, username, password, email, "Student", profileImage);
            
            // Parse enrolled subjects from string to Integer array
            Integer[] enrolledSubjects;
            if (enrolledSubjectsStr != null && !enrolledSubjectsStr.isEmpty()) {
                String[] subjectStrings = enrolledSubjectsStr.replace("{", "").replace("}", "").split(",");
                enrolledSubjects = new Integer[subjectStrings.length];
                for (int i = 0; i < subjectStrings.length; i++) {
                    enrolledSubjects[i] = Integer.parseInt(subjectStrings[i].trim());
                }
            } else {
                enrolledSubjects = new Integer[0];
            }
            
            // Create student record
            Student student = new Student();
            student.setUser(newUser);
            student.setEnrolledSubjects(enrolledSubjects);
            student.setAttemptedQuiz(new Integer[0]);
            
            Student newStudent = studentService.updateStudent(student);
            
            Map<String, Object> response = new HashMap<>();
            response.put("user", newUser);
            response.put("student", newStudent);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to add student user: " + e.getMessage()));
        }
    }
    
    // REGISTER NEW TEACHER USER WITH SUBJECTS TAUGHT - COMBINED ENDPOINT
    @PostMapping("/user/addTeacher")
    public ResponseEntity<?> addTeacherWithSubjects(
            @RequestParam("fname") String fname,
            @RequestParam("lname") String lname,
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestParam(value = "subjectTaught", required = false) String subjectTaughtStr) {
        
        try {
            // Create user with Teacher role
            User newUser = adminService.addUser(fname, lname, username, password, email, "Teacher", profileImage);
            
            // Parse subjects taught from string to Integer array
            Integer[] subjectTaught;
            if (subjectTaughtStr != null && !subjectTaughtStr.isEmpty()) {
                String[] subjectStrings = subjectTaughtStr.replace("{", "").replace("}", "").split(",");
                subjectTaught = new Integer[subjectStrings.length];
                for (int i = 0; i < subjectStrings.length; i++) {
                    subjectTaught[i] = Integer.parseInt(subjectStrings[i].trim());
                }
            } else {
                subjectTaught = new Integer[0];
            }
            
            // Create teacher record
            Teacher teacher = new Teacher();
            teacher.setUser(newUser);
            teacher.setSubjectTaught(subjectTaught);
            teacher.setCreatedQuiz(new Integer[0]);
            
            Teacher newTeacher = teacherService.updateTeacher(teacher);
            
            Map<String, Object> response = new HashMap<>();
            response.put("user", newUser);
            response.put("teacher", newTeacher);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to add teacher user: " + e.getMessage()));
        }
    }

    
    // REMOVE SUBJECT FROM TEACHER SUBJECTS TAUGHT
    @DeleteMapping("/user/teacher/{userId}/remove-subject/{subjectId}")
    public ResponseEntity<?> removeTeacherSubjectTaught(
            @PathVariable Long userId,
            @PathVariable Integer subjectId) {
        
        try {
            // Find existing teacher record
            Teacher teacher = teacherService.getTeacherByUserId(userId);
            if (teacher == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Teacher record not found for user id: " + userId));
            }
            
            // Get current subjects and remove the specified one
            Integer[] currentSubjects = teacher.getSubjectTaught();
            
            // Check if subject exists and create a new array without it
            boolean found = false;
            Integer[] updatedSubjects = new Integer[currentSubjects.length - 1];
            int j = 0;
            
            for (Integer subject : currentSubjects) {
                if (!subject.equals(subjectId)) {
                    if (j < updatedSubjects.length) {
                        updatedSubjects[j++] = subject;
                    }
                } else {
                    found = true;
                }
            }
            
            if (!found) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Subject not found in teacher's subjects taught"));
            }
            
            // Update teacher record
            teacher.setSubjectTaught(updatedSubjects);
            Teacher updatedTeacher = teacherService.updateTeacher(teacher);
            
            return ResponseEntity.ok(Map.of(
                "message", "Subject removed successfully",
                "teacher", updatedTeacher
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to remove subject: " + e.getMessage()));
        }
    }    // DELETE USER WITH CASCADE - Works for both Teacher and Student
    @DeleteMapping("/deleteUser/{userId}")
    public ResponseEntity<?> deleteUserWithCascade(@PathVariable Long userId) {
        try {
            // Check if the user exists
            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found with id: " + userId));
            }
            
            User user = userOpt.get();
            
            // Create response with details
            Map<String, Object> response = new HashMap<>();
            response.put("userId", userId);
            response.put("username", user.getUsername());
            response.put("role", user.getRole());
            
            // Execute cascade delete
            boolean deleted = userService.deleteUserWithCascade(userId);
            
            if (deleted) {
                response.put("success", true);
                response.put("message", "User and all associated records deleted successfully");
            } else {
                response.put("success", false);
                response.put("message", "Failed to delete user");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete user: " + e.getMessage()));
        }
    }// UPDATE USER PROFILE BASED ON USER ID - Update only fname, lname, profile, bio, password
    @PutMapping("/user/{userId}")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable Long userId,
            @RequestParam(value = "fname", required = false) String fname,
            @RequestParam(value = "lname", required = false) String lname,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        
        try {
            // First check if the user exists
            Optional<User> existingUserOpt = userService.getUserById(userId);
            if (existingUserOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found with id: " + userId));
            }
            
            User existingUser = existingUserOpt.get();
            
            // Update only allowed fields, keeping existing values if new ones aren't provided
            if (fname != null) {
                existingUser.setFname(fname);
            }
            
            if (lname != null) {
                existingUser.setLname(lname);
            }
            
            if (bio != null) {
                existingUser.setBio(bio);
            }
            
            if (password != null && !password.isEmpty()) {
                existingUser.setPassword(password);
            }
            
            // Upload and update profile image if provided
            if (profileImage != null && !profileImage.isEmpty()) {
                String profileImageUrl = cloudinaryService.uploadFile(profileImage);
                existingUser.setProfileImageUrl(profileImageUrl);
            }
            
            // Save the updated user
            User updatedUser = userService.saveUser(existingUser);
            
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update user: " + e.getMessage()));
        }
    }

    // GET ALL SUBJECTS
    @GetMapping("/subjects")
    public ResponseEntity<List<Subject>> getAllSubjects() {
        List<Subject> subjects = subjectService.getAllSubjects();
        return ResponseEntity.ok(subjects);
    }
    
    // GET SUBJECT BY ID
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<?> getSubjectById(@PathVariable Integer subjectId) {
        return subjectService.getSubjectById(subjectId)
                .map(subject -> ResponseEntity.ok(subject))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
