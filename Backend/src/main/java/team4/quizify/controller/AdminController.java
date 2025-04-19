package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import team4.quizify.entity.Student;
import team4.quizify.entity.Teacher;
import team4.quizify.entity.User;
import team4.quizify.service.AdminService;
import team4.quizify.service.CloudinaryService;
import team4.quizify.service.StudentService;
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
    
    //ADD USER
    @PostMapping("/user")
    public ResponseEntity<?> addUser(
            @RequestParam("fname") String fname,
            @RequestParam("lname") String lname,
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email,
            @RequestParam("role") String role,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        
        try {
            User newUser = adminService.addUser(fname, lname, username, password, email, role, profileImage);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to add user: " + e.getMessage()));
        }
    }
    
    //DELETE USER
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> removeUser(@PathVariable Long userId) {
        try {
            adminService.removeUser(userId);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete user: " + e.getMessage()));
        }
    }
    
    //DELETE USER
    @PutMapping("/user/{userId}")
    public ResponseEntity<?> editUser(
            @PathVariable Long userId,
            @RequestParam("fname") String fname,
            @RequestParam("lname") String lname,
            @RequestParam("username") String username,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam("email") String email,
            @RequestParam("role") String role,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        
        try {
            User updatedUser = adminService.editUser(userId, fname, lname, username, password, email, role, profileImage);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update user: " + e.getMessage()));
        }
    }
    
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
    
    //DELETE USER BY USERNAME
    @DeleteMapping("/user/username/{username}")
    public ResponseEntity<?> deleteUserByUsername(@PathVariable String username) {
        boolean deleted = userService.deleteUserByUsername(username);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found with username: " + username));
        }
    }    //UPDATE USER BY USERNAME - Only change bio, password, fname, lname, profile
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

    // REGISTER NEW STUDENT USER
    @PostMapping("/user/addUser/student")
    public ResponseEntity<?> addStudentUser(
            @RequestParam("fname") String fname,
            @RequestParam("lname") String lname,
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        
        try {
            // Create user with Student role
            User newUser = adminService.addUser(fname, lname, username, password, email, "Student", profileImage);
            
            // Create an empty student record
            Student student = new Student();
            student.setUser(newUser);
            student.setEnrolledSubjects(new Integer[0]);
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

    // REGISTER NEW TEACHER USER
    @PostMapping("/user/addUser/teacher")
    public ResponseEntity<?> addTeacherUser(
            @RequestParam("fname") String fname,
            @RequestParam("lname") String lname,
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        
        try {
            // Create user with Teacher role
            User newUser = adminService.addUser(fname, lname, username, password, email, "Teacher", profileImage);
            
            // Create an empty teacher record
            Teacher teacher = new Teacher();
            teacher.setUser(newUser);
            teacher.setSubjectTaught(new Integer[0]);
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
    
    // UPDATE STUDENT ENROLLED SUBJECTS
    @PostMapping("/user/student/{userId}")
    public ResponseEntity<?> updateStudentEnrolledSubjects(
            @PathVariable Long userId,
            @RequestParam("enrolledSubjects") String enrolledSubjectsStr) {
        
        try {
            // Find user by ID
            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found with id: " + userId));
            }
            User user = userOpt.get();
            
            // Find existing student record or create new one
            Student student = studentService.getStudentByUserId(user.getId());
            boolean isNewStudent = false;
            
            if (student == null) {
                student = new Student();
                student.setUser(user);
                student.setAttemptedQuiz(new Integer[0]);
                isNewStudent = true;
            }
            
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
            
            // Update student subjects
            student.setEnrolledSubjects(enrolledSubjects);
            Student updatedStudent = studentService.updateStudent(student);
            
            return ResponseEntity.ok(Map.of(
                "message", isNewStudent ? "Student record created with enrolled subjects" : "Student enrolled subjects updated",
                "student", updatedStudent
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update student enrolled subjects: " + e.getMessage()));
        }
    }
    
    // UPDATE TEACHER SUBJECTS TAUGHT
    @PostMapping("/user/teacher/{userId}")
    public ResponseEntity<?> updateTeacherSubjectsTaught(
            @PathVariable Long userId,
            @RequestParam("subjectTaught") String subjectTaughtStr) {
        
        try {
            // Find user by ID
            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found with id: " + userId));
            }
            User user = userOpt.get();
            
            // Find existing teacher record or create new one
            Teacher teacher = teacherService.getTeacherByUserId(user.getId());
            boolean isNewTeacher = false;
            
            if (teacher == null) {
                teacher = new Teacher();
                teacher.setUser(user);
                teacher.setCreatedQuiz(new Integer[0]);
                isNewTeacher = true;
            }
            
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
            
            // Update teacher subjects
            teacher.setSubjectTaught(subjectTaught);
            Teacher updatedTeacher = teacherService.updateTeacher(teacher);
            
            return ResponseEntity.ok(Map.of(
                "message", isNewTeacher ? "Teacher record created with subjects taught" : "Teacher subjects taught updated",
                "teacher", updatedTeacher
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update teacher subjects taught: " + e.getMessage()));
        }
    }
    
    // ADD SUBJECT TO STUDENT ENROLLED SUBJECTS
    @PostMapping("/user/student/{userId}/add-subject")
    public ResponseEntity<?> addStudentEnrolledSubject(
            @PathVariable Long userId,
            @RequestParam("subjectId") Integer subjectId) {
        
        try {
            // Find user by ID
            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found with id: " + userId));
            }
            
            // Find existing student record
            Student student = studentService.getStudentByUserId(userId);
            if (student == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Student record not found for user id: " + userId));
            }
            
            // Get current subjects and add the new one if not already present
            Integer[] currentSubjects = student.getEnrolledSubjects();
            
            // Check if subject already exists
            boolean alreadyEnrolled = false;
            for (Integer subject : currentSubjects) {
                if (subject.equals(subjectId)) {
                    alreadyEnrolled = true;
                    break;
                }
            }
            
            if (alreadyEnrolled) {
                return ResponseEntity.ok(Map.of(
                    "message", "Subject already enrolled",
                    "student", student
                ));
            }
            
            // Add the new subject
            Integer[] updatedSubjects = new Integer[currentSubjects.length + 1];
            System.arraycopy(currentSubjects, 0, updatedSubjects, 0, currentSubjects.length);
            updatedSubjects[currentSubjects.length] = subjectId;
            
            // Update student record
            student.setEnrolledSubjects(updatedSubjects);
            Student updatedStudent = studentService.updateStudent(student);
            
            return ResponseEntity.ok(Map.of(
                "message", "Subject added successfully",
                "student", updatedStudent
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to add subject: " + e.getMessage()));
        }
    }
    
    // REMOVE SUBJECT FROM STUDENT ENROLLED SUBJECTS
    @DeleteMapping("/user/student/{userId}/remove-subject/{subjectId}")
    public ResponseEntity<?> removeStudentEnrolledSubject(
            @PathVariable Long userId,
            @PathVariable Integer subjectId) {
        
        try {
            // Find existing student record
            Student student = studentService.getStudentByUserId(userId);
            if (student == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Student record not found for user id: " + userId));
            }
            
            // Get current subjects and remove the specified one
            Integer[] currentSubjects = student.getEnrolledSubjects();
            
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
                        .body(Map.of("error", "Subject not found in student's enrolled subjects"));
            }
            
            // Update student record
            student.setEnrolledSubjects(updatedSubjects);
            Student updatedStudent = studentService.updateStudent(student);
            
            return ResponseEntity.ok(Map.of(
                "message", "Subject removed successfully",
                "student", updatedStudent
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to remove subject: " + e.getMessage()));
        }
    }
    
    // ADD SUBJECT TO TEACHER SUBJECTS TAUGHT
    @PostMapping("/user/teacher/{userId}/add-subject")
    public ResponseEntity<?> addTeacherSubjectTaught(
            @PathVariable Long userId,
            @RequestParam("subjectId") Integer subjectId) {
        
        try {
            // Find user by ID
            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found with id: " + userId));
            }
            
            // Find existing teacher record
            Teacher teacher = teacherService.getTeacherByUserId(userId);
            if (teacher == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Teacher record not found for user id: " + userId));
            }
            
            // Get current subjects and add the new one if not already present
            Integer[] currentSubjects = teacher.getSubjectTaught();
            
            // Check if subject already exists
            boolean alreadyTeaches = false;
            for (Integer subject : currentSubjects) {
                if (subject.equals(subjectId)) {
                    alreadyTeaches = true;
                    break;
                }
            }
            
            if (alreadyTeaches) {
                return ResponseEntity.ok(Map.of(
                    "message", "Subject already being taught",
                    "teacher", teacher
                ));
            }
            
            // Add the new subject
            Integer[] updatedSubjects = new Integer[currentSubjects.length + 1];
            System.arraycopy(currentSubjects, 0, updatedSubjects, 0, currentSubjects.length);
            updatedSubjects[currentSubjects.length] = subjectId;
            
            // Update teacher record
            teacher.setSubjectTaught(updatedSubjects);
            Teacher updatedTeacher = teacherService.updateTeacher(teacher);
            
            return ResponseEntity.ok(Map.of(
                "message", "Subject added successfully",
                "teacher", updatedTeacher
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to add subject: " + e.getMessage()));
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
    }
}
