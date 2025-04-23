package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import team4.quizify.entity.Report;
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
import team4.quizify.repository.ReportRepository;

import java.util.ArrayList;
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

    @Autowired
    private ReportRepository reportRepository;

    //GET ALL USERS
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    //GET USER BY ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Integer userId) {
        return userService.getUserById(userId)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
    
    //CHECK DUPLICATE USERNAME OR EMAIL
    @GetMapping("/check-duplicate")
    public ResponseEntity<?> isDuplicateValue(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email) {
        Map<String, Boolean> response = new HashMap<>();
        
        if (username != null) {
            response.put("username", userService.isUsernameExists(username));
        }
        if (email != null) {
            response.put("email", userService.isEmailExists(email));
        }
        
        return ResponseEntity.ok(response);
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
    public ResponseEntity<?> getStudentById(@PathVariable Integer studentId) {
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
    public ResponseEntity<?> getTeacherById(@PathVariable Integer teacherId) {
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
            // Get existing user
            Optional<User> existingUserOpt = userService.getUserByUsername(username);
            if (existingUserOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found with username: " + username));
            }
            
            User existingUser = existingUserOpt.get();
            
            // Update fields if provided
            if (fname != null) existingUser.setFname(fname);
            if (lname != null) existingUser.setLname(lname);
            if (bio != null) existingUser.setBio(bio);
            if (password != null) existingUser.setPassword(password);
            
            // Handle profile image upload
            if (profileImage != null && !profileImage.isEmpty()) {
                String imageUrl = cloudinaryService.uploadFile(profileImage);
                existingUser.setProfileImageUrl(imageUrl);
            }
            
            // Save updated user
            User updatedUser = userService.saveUser(existingUser);
            return ResponseEntity.ok(updatedUser);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update user: " + e.getMessage()));
        }
    }
    
    // REGISTER NEW STUDENT USER WITH ENROLLED SUBJECTS
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
                String[] subjectStrings = enrolledSubjectsStr.split(",");
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
    
    // REGISTER NEW TEACHER USER WITH SUBJECTS TAUGHT
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
                String[] subjectStrings = subjectTaughtStr.split(",");
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
    
    
    // UPDATE USER PROFILE BASED ON USER ID - Update only fname, lname, profile, bio, password
    @PutMapping("/user/{userId}")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable Integer userId,
            @RequestParam(value = "fname", required = false) String fname,
            @RequestParam(value = "lname", required = false) String lname,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        try {
            User updatedUser = adminService.editUser(userId, fname, lname, null, password, null, null, profileImage);
            if (bio != null) updatedUser.setBio(bio);
            return ResponseEntity.ok(userService.saveUser(updatedUser));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update user profile: " + e.getMessage()));
        }
    }
    
    // GET ALL SUBJECTS
    @GetMapping("/subjects")
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }
      // GET SUBJECT BY ID
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<?> getSubjectById(@PathVariable Integer subjectId) {
        Optional<Subject> subject = subjectService.getSubjectById(subjectId);
        if (subject.isPresent()) {
            return ResponseEntity.ok(subject.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Subject not found with id: " + subjectId));
        }
    }
    
    // ADD ENROLLED SUBJECTS TO STUDENT
    @PostMapping("/student/{studentId}/addSubjects")
    public ResponseEntity<?> addEnrolledSubjectsToStudent(
            @PathVariable Integer studentId,
            @RequestParam("subjectsToAdd") String subjectsToAddStr) {
        try {
            // Get the student by ID
            Student student = studentService.getStudentByStudentId(studentId);
            if (student == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Student not found with id: " + studentId));
            }
            
            // Parse the new subjects to add
            Integer[] subjectsToAdd;
            if (subjectsToAddStr != null && !subjectsToAddStr.isEmpty()) {
                String[] subjectStrings = subjectsToAddStr.split(",");
                subjectsToAdd = new Integer[subjectStrings.length];
                for (int i = 0; i < subjectStrings.length; i++) {
                    subjectsToAdd[i] = Integer.parseInt(subjectStrings[i].trim());
                }
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "No subjects specified to add"));
            }
            
            // Get current enrolled subjects
            Integer[] currentSubjects = student.getEnrolledSubjects();
            
            // Create a list to store unique subjects
            List<Integer> updatedSubjects = new ArrayList<>();
            
            // Add existing subjects to the list
            if (currentSubjects != null && currentSubjects.length > 0) {
                for (Integer subjectId : currentSubjects) {
                    updatedSubjects.add(subjectId);
                }
            }
            
            // Add new subjects, avoiding duplicates
            for (Integer subjectId : subjectsToAdd) {
                if (!updatedSubjects.contains(subjectId)) {
                    updatedSubjects.add(subjectId);
                }
            }
            
            // Update the student's enrolled subjects
            student.setEnrolledSubjects(updatedSubjects.toArray(new Integer[0]));
            
            // Save the updated student record
            Student updatedStudent = studentService.updateStudent(student);
            
            return ResponseEntity.ok(Map.of(
                "message", "Enrolled subjects updated successfully",
                "student", updatedStudent
            ));
            
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid subject ID format. Please provide comma-separated integers."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update enrolled subjects: " + e.getMessage()));
        }
    }
    
    // ADD SUBJECTS TAUGHT TO TEACHER
    @PostMapping("/teacher/{teacherId}/addSubjects")
    public ResponseEntity<?> addTeacherWithSubjects(
            @PathVariable Integer teacherId,
            @RequestParam("subjectsToAdd") String subjectsToAddStr) {
        try {
            // Get the teacher by ID
            Teacher teacher = teacherService.getTeacherByTeacherId(teacherId);
            if (teacher == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Teacher not found with id: " + teacherId));
            }
            
            // Parse the new subjects to add
            Integer[] subjectsToAdd;
            if (subjectsToAddStr != null && !subjectsToAddStr.isEmpty()) {
                String[] subjectStrings = subjectsToAddStr.split(",");
                subjectsToAdd = new Integer[subjectStrings.length];
                for (int i = 0; i < subjectStrings.length; i++) {
                    subjectsToAdd[i] = Integer.parseInt(subjectStrings[i].trim());
                }
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "No subjects specified to add"));
            }
            
            // Get current subjects taught
            Integer[] currentSubjects = teacher.getSubjectTaught();
            
            // Create a list to store unique subjects
            List<Integer> updatedSubjects = new ArrayList<>();
            
            // Add existing subjects to the list
            if (currentSubjects != null && currentSubjects.length > 0) {
                for (Integer subjectId : currentSubjects) {
                    updatedSubjects.add(subjectId);
                }
            }
            
            // Add new subjects, avoiding duplicates
            for (Integer subjectId : subjectsToAdd) {
                if (!updatedSubjects.contains(subjectId)) {
                    updatedSubjects.add(subjectId);
                }
            }
            
            // Update the teacher's subjects taught
            teacher.setSubjectTaught(updatedSubjects.toArray(new Integer[0]));
            
            // Save the updated teacher record
            Teacher updatedTeacher = teacherService.updateTeacher(teacher);
            
            return ResponseEntity.ok(Map.of(
                "message", "Subjects taught updated successfully",
                "teacher", updatedTeacher
            ));
            
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid subject ID format. Please provide comma-separated integers."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update subjects taught: " + e.getMessage()));
        }
    }
    
    // REMOVE ENROLLED SUBJECTS FROM STUDENT
    @PostMapping("/student/{studentId}/removeSubjects")
    public ResponseEntity<?> removeEnrolledSubjectsFromStudent(
            @PathVariable Integer studentId,
            @RequestParam("subjectsToRemove") String subjectsToRemoveStr) {
        try {
            // Get the student by ID
            Student student = studentService.getStudentByStudentId(studentId);
            if (student == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Student not found with id: " + studentId));
            }
            
            // Parse the subjects to remove
            Integer[] subjectsToRemove;
            if (subjectsToRemoveStr != null && !subjectsToRemoveStr.isEmpty()) {
                String[] subjectStrings = subjectsToRemoveStr.split(",");
                subjectsToRemove = new Integer[subjectStrings.length];
                for (int i = 0; i < subjectStrings.length; i++) {
                    subjectsToRemove[i] = Integer.parseInt(subjectStrings[i].trim());
                }
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "No subjects specified to remove"));
            }
            
            // Get current enrolled subjects
            Integer[] currentSubjects = student.getEnrolledSubjects();
            if (currentSubjects == null || currentSubjects.length == 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Student has no enrolled subjects to remove"));
            }
            
            // Create a list to store subjects after removal
            List<Integer> updatedSubjects = new ArrayList<>();
            
            // Add existing subjects to the list except those to be removed
            for (Integer subjectId : currentSubjects) {
                boolean shouldRemove = false;
                for (Integer removeId : subjectsToRemove) {
                    if (subjectId.equals(removeId)) {
                        shouldRemove = true;
                        break;
                    }
                }
                if (!shouldRemove) {
                    updatedSubjects.add(subjectId);
                }
            }
            
            // Update the student's enrolled subjects
            student.setEnrolledSubjects(updatedSubjects.toArray(new Integer[0]));
            
            // Save the updated student record
            Student updatedStudent = studentService.updateStudent(student);
            
            return ResponseEntity.ok(Map.of(
                "message", "Enrolled subjects updated successfully",
                "student", updatedStudent
            ));
            
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid subject ID format. Please provide comma-separated integers."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to remove enrolled subjects: " + e.getMessage()));
        }
    }
    
    // REMOVE SUBJECTS TAUGHT BY TEACHER
    @PostMapping("/teacher/{teacherId}/removeSubjects")
    public ResponseEntity<?> removeSubjectsTaughtByTeacher(
            @PathVariable Integer teacherId,
            @RequestParam("subjectsToRemove") String subjectsToRemoveStr) {
        try {
            // Get the teacher by ID
            Teacher teacher = teacherService.getTeacherByTeacherId(teacherId);
            if (teacher == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Teacher not found with id: " + teacherId));
            }
            
            // Parse the subjects to remove
            Integer[] subjectsToRemove;
            if (subjectsToRemoveStr != null && !subjectsToRemoveStr.isEmpty()) {
                String[] subjectStrings = subjectsToRemoveStr.split(",");
                subjectsToRemove = new Integer[subjectStrings.length];
                for (int i = 0; i < subjectStrings.length; i++) {
                    subjectsToRemove[i] = Integer.parseInt(subjectStrings[i].trim());
                }
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "No subjects specified to remove"));
            }
            
            // Get current subjects taught
            Integer[] currentSubjects = teacher.getSubjectTaught();
            if (currentSubjects == null || currentSubjects.length == 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Teacher has no subjects taught to remove"));
            }
            
            // Create a list to store subjects after removal
            List<Integer> updatedSubjects = new ArrayList<>();
            
            // Add existing subjects to the list except those to be removed
            for (Integer subjectId : currentSubjects) {
                boolean shouldRemove = false;
                for (Integer removeId : subjectsToRemove) {
                    if (subjectId.equals(removeId)) {
                        shouldRemove = true;
                        break;
                    }
                }
                if (!shouldRemove) {
                    updatedSubjects.add(subjectId);
                }
            }
            
            // Update the teacher's subjects taught
            teacher.setSubjectTaught(updatedSubjects.toArray(new Integer[0]));
            
            // Save the updated teacher record
            Teacher updatedTeacher = teacherService.updateTeacher(teacher);
            
            return ResponseEntity.ok(Map.of(
                "message", "Subjects taught updated successfully",
                "teacher", updatedTeacher
            ));
            
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid subject ID format. Please provide comma-separated integers."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to remove subjects taught: " + e.getMessage()));
        }
    }
    
    // DELETE USER AND ALL ASSOCIATED RECORDS
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer userId) {
        try {
            // Get user first to check role
            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found with id: " + userId));
            }            // Delete reports associated with the user
            List<Report> userReports = reportRepository.findByUserId(userId);
            reportRepository.deleteAll(userReports);

            // Delete user and associated records based on role
            adminService.removeUser(userId);

            return ResponseEntity.ok(Map.of("message", "User and associated records deleted successfully"));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete user: " + e.getMessage()));
        }
    }
}