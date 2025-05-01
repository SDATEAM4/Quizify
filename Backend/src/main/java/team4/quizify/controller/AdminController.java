package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import team4.quizify.entity.Report;
import team4.quizify.entity.Student;
import team4.quizify.entity.Subject;
import team4.quizify.entity.Teacher;
import team4.quizify.entity.User;
import team4.quizify.patterns.adapter.StorageManager;
import team4.quizify.patterns.singleton.AdminServiceSingleton;
import team4.quizify.patterns.template.StudentCreationTemplate;
import team4.quizify.patterns.template.TeacherCreationTemplate;
import team4.quizify.service.AdminService;
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
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/Quizify/admin")
public class AdminController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private StorageManager storageManager;
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private TeacherService teacherService;
    
    @Autowired
    private SubjectService subjectService;

    @Autowired
    private ReportRepository reportRepository;
    
    @Autowired
    private ApplicationContext applicationContext;
    
    @Autowired
    private StudentCreationTemplate studentCreationTemplate;
    
    @Autowired
    private TeacherCreationTemplate teacherCreationTemplate;

    //GET ALL USERS
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            // Get the AdminService singleton instance
            AdminServiceSingleton adminServiceSingleton = AdminServiceSingleton.getInstance(applicationContext);
           adminServiceSingleton.getAdminService();
            
            List<User> users = userService.getAllUsers();
            if (users.isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "User not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal error while fetching data");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    //GET USER BY ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Integer userId) {
        try {
            Optional<User> user = userService.getUserById(userId);
            if (user.isPresent()) {
                User userData = user.get();
                Map<String, Object> response = new HashMap<>();
                response.put("user", userData);
                // Check if user is a student and add subject names and student ID
                if ("Student".equals(userData.getRole())) {
                    Student student = studentService.getStudentByUserId(userId);
                    if (student != null) {
                        // Add student ID to response
                        response.put("studentId", student.getStudent_id());
                        
                        if (student.getEnrolledSubjects() != null) {
                            List<Map<String, Object>> subjectsWithNames = new ArrayList<>();
                            for (Integer subjectId : student.getEnrolledSubjects()) {
                                Optional<Subject> subject = subjectService.getSubjectById(subjectId);
                                if (subject.isPresent()) {
                                    Map<String, Object> subjectInfo = new HashMap<>();
                                    subjectInfo.put("id", subjectId);
                                    subjectInfo.put("name", subject.get().getName());
                                    subjectInfo.put("description", subject.get().getDescription());
                                    subjectInfo.put("imageUrl", subject.get().getImageUrl());
                                    subjectsWithNames.add(subjectInfo);
                                }
                            }
                            response.put("enrolledSubjectsWithNames", subjectsWithNames);
                        }
                    }
                }
                
                // Check if user is a teacher and add subject names and teacher ID
                if ("Teacher".equals(userData.getRole())) {
                    // Existing implementation remains unchanged
                }
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "User not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal error while fetching data");
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
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
    
    @GetMapping("/user/username/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        try {
            Optional<User> user = userService.getUserByUsername(username);
            if (user.isPresent()) {
                User userData = user.get();
                Map<String, Object> response = new HashMap<>();
                response.put("user", userData);
                
                // Check if user is a student and add subject names and student ID
                if ("Student".equals(userData.getRole())) {
                    Student student = studentService.getStudentByUserId(userData.getUserId());
                    if (student != null) {
                        // Add student ID to response
                        response.put("studentId", student.getStudent_id());
                        
                        if (student.getEnrolledSubjects() != null) {
                            List<Map<String, Object>> subjectsWithNames = new ArrayList<>();
                            for (Integer subjectId : student.getEnrolledSubjects()) {
                                Optional<Subject> subject = subjectService.getSubjectById(subjectId);
                                if (subject.isPresent()) {
                                    Map<String, Object> subjectInfo = new HashMap<>();
                                    subjectInfo.put("id", subjectId);
                                    subjectInfo.put("name", subject.get().getName());
                                    subjectInfo.put("description", subject.get().getDescription());
                                    subjectInfo.put("imageUrl", subject.get().getImageUrl());
                                    subjectsWithNames.add(subjectInfo);
                                }
                            }
                            response.put("enrolledSubjectsWithNames", subjectsWithNames);
                        }
                    }
                }
                
                // Check if user is a teacher and add subject names and teacher ID
                if ("Teacher".equals(userData.getRole())) {
                    Teacher teacher = teacherService.getTeacherByUserId(userData.getUserId());
                    if (teacher != null) {
                        // Add teacher ID to response
                        response.put("teacherId", teacher.getTeacher_id());
                        
                        if (teacher.getSubjectTaught() != null) {
                            List<Map<String, Object>> subjectsWithNames = new ArrayList<>();
                            for (Integer subjectId : teacher.getSubjectTaught()) {
                                Optional<Subject> subject = subjectService.getSubjectById(subjectId);
                                if (subject.isPresent()) {
                                    Map<String, Object> subjectInfo = new HashMap<>();
                                    subjectInfo.put("id", subjectId);
                                    subjectInfo.put("name", subject.get().getName());
                                    subjectInfo.put("description", subject.get().getDescription());
                                    subjectInfo.put("imageUrl", subject.get().getImageUrl());
                                    subjectsWithNames.add(subjectInfo);
                                }
                            }
                            response.put("subjectsTaughtWithNames", subjectsWithNames);
                        }
                    }
                }
                
                return ResponseEntity.ok().body(response);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "User not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal error while fetching data");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/user/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        try {
            Optional<User> user = userService.getUserByEmail(email);
            if (user.isPresent()) {
                User userData = user.get();
                Map<String, Object> response = new HashMap<>();
                response.put("user", userData);
                
                // Check if user is a student and add subject names and student ID
                if ("Student".equals(userData.getRole())) {
                    Student student = studentService.getStudentByUserId(userData.getUserId());
                    if (student != null) {
                        // Add student ID to response
                        response.put("studentId", student.getStudent_id());
                        
                        if (student.getEnrolledSubjects() != null) {
                            List<Map<String, Object>> subjectsWithNames = new ArrayList<>();
                            for (Integer subjectId : student.getEnrolledSubjects()) {
                                Optional<Subject> subject = subjectService.getSubjectById(subjectId);
                                if (subject.isPresent()) {
                                    Map<String, Object> subjectInfo = new HashMap<>();
                                    subjectInfo.put("id", subjectId);
                                    subjectInfo.put("name", subject.get().getName());
                                    subjectInfo.put("description", subject.get().getDescription());
                                    subjectInfo.put("imageUrl", subject.get().getImageUrl());
                                    subjectsWithNames.add(subjectInfo);
                                }
                            }
                            response.put("enrolledSubjectsWithNames", subjectsWithNames);
                        }
                    }
                }
                
                // Check if user is a teacher and add subject names and teacher ID
                if ("Teacher".equals(userData.getRole())) {
                    Teacher teacher = teacherService.getTeacherByUserId(userData.getUserId());
                    if (teacher != null) {
                        // Add teacher ID to response
                        response.put("teacherId", teacher.getTeacher_id());
                        
                        if (teacher.getSubjectTaught() != null) {
                            List<Map<String, Object>> subjectsWithNames = new ArrayList<>();
                            for (Integer subjectId : teacher.getSubjectTaught()) {
                                Optional<Subject> subject = subjectService.getSubjectById(subjectId);
                                if (subject.isPresent()) {
                                    Map<String, Object> subjectInfo = new HashMap<>();
                                    subjectInfo.put("id", subjectId);
                                    subjectInfo.put("name", subject.get().getName());
                                    subjectInfo.put("description", subject.get().getDescription());
                                    subjectInfo.put("imageUrl", subject.get().getImageUrl());
                                    subjectsWithNames.add(subjectInfo);
                                }
                            }
                            response.put("subjectsTaughtWithNames", subjectsWithNames);
                        }
                    }
                }
                
                return ResponseEntity.ok().body(response);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "User not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal error while fetching data");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentById(@PathVariable Integer studentId) {
        try {
            Student student = studentService.getStudentByStudentId(studentId);
            if (student != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("student", student);
                
                // Add subject names for enrolled subjects
                List<Map<String, Object>> enrolledSubjectsWithNames = new ArrayList<>();
                if (student.getEnrolledSubjects() != null) {
                    for (Integer subjectId : student.getEnrolledSubjects()) {
                        Optional<Subject> subject = subjectService.getSubjectById(subjectId);
                        if (subject.isPresent()) {
                            Map<String, Object> subjectInfo = new HashMap<>();
                            subjectInfo.put("id", subjectId);
                            subjectInfo.put("name", subject.get().getName());
                            subjectInfo.put("description", subject.get().getDescription());
                            subjectInfo.put("imageUrl", subject.get().getImageUrl());
                            enrolledSubjectsWithNames.add(subjectInfo);
                        }
                    }
                }
                response.put("enrolledSubjectsWithNames", enrolledSubjectsWithNames);
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "User not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal error while fetching data");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getTeacherById(@PathVariable Integer teacherId) {
        try {
            Teacher teacher = teacherService.getTeacherByTeacherId(teacherId);
            if (teacher != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("teacher", teacher);
                
                // Add subject names for subjects taught
                List<Map<String, Object>> taughtSubjectsWithNames = new ArrayList<>();
                if (teacher.getSubjectTaught() != null) {
                    for (Integer subjectId : teacher.getSubjectTaught()) {
                        Optional<Subject> subject = subjectService.getSubjectById(subjectId);
                        if (subject.isPresent()) {
                            Map<String, Object> subjectInfo = new HashMap<>();
                            subjectInfo.put("id", subjectId);
                            subjectInfo.put("name", subject.get().getName());
                            subjectInfo.put("description", subject.get().getDescription());
                            subjectInfo.put("imageUrl", subject.get().getImageUrl());
                            taughtSubjectsWithNames.add(subjectInfo);
                        }
                    }
                }
                response.put("subjectsTaughtWithNames", taughtSubjectsWithNames);
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "User not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal error while fetching data");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
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
                        .body(Map.of("error", "User not found"));
            }
            
            User existingUser = existingUserOpt.get();
            
            // Update fields if provided
            if (fname != null) existingUser.setFname(fname);
            if (lname != null) existingUser.setLname(lname);
            if (bio != null) existingUser.setBio(bio);
            if (password != null) existingUser.setPassword(password);
            
            // Handle profile image upload using the StorageManager adapter pattern
            if (profileImage != null && !profileImage.isEmpty()) {
                String imageUrl = storageManager.uploadFile(profileImage);
                existingUser.setProfileImageUrl(imageUrl);
            }
            
            // Save updated user
            userService.saveUser(existingUser);
            return ResponseEntity.ok(Map.of("message", "User updated successfully"));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update user: " + e.getMessage()));
        }
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable Integer userId,
            @RequestParam(value = "fname", required = false) String fname,
            @RequestParam(value = "lname", required = false) String lname,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        try {
            // Get the AdminService singleton instance
            AdminServiceSingleton adminServiceSingleton = AdminServiceSingleton.getInstance(applicationContext);
            AdminService adminService = adminServiceSingleton.getAdminService();

            User updatedUser = adminService.editUser(userId, fname, lname, null, password, null, null, profileImage);
            if (bio != null) updatedUser.setBio(bio);
            userService.saveUser(updatedUser);
            return ResponseEntity.ok(Map.of("message", "User updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update user profile: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer userId) {
        try {
            // Get the AdminService singleton instance
            AdminServiceSingleton adminServiceSingleton = AdminServiceSingleton.getInstance(applicationContext);
            AdminService adminService = adminServiceSingleton.getAdminService();            // Get user first to check role
            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }
            
            User user = userOpt.get();
            
            // If user is a teacher, remove them from subjects
            if ("Teacher".equals(user.getRole())) {
                Teacher teacher = teacherService.getTeacherByUserId(userId);
                if (teacher != null) {
                    Integer teacherId = teacher.getTeacher_id();
                    Integer[] subjectsTaught = teacher.getSubjectTaught();
                    
                    if (subjectsTaught != null) {
                        // Remove teacher from all subjects they taught
                        for (Integer subjectId : subjectsTaught) {
                            subjectService.removeTeacherFromSubject(subjectId, teacherId);
                        }
                    }
                }
            }
            
            // Delete reports associated with the user
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
            // Create user with Student role using Template Method pattern
        
            User newUser = studentCreationTemplate.createUser(fname, lname, username, password, email, "Student", profileImage);
            
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
            
            // Get the existing student record that was created in the template
            Student student = studentService.getStudentByUserId(newUser.getUserId());
            if (student != null) {
                // Update only the enrolled subjects
                student.setEnrolledSubjects(enrolledSubjects);
                studentService.updateStudent(student);
            }
            
            // Return response with student ID
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "User added successfully"
            ));
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to add student user: " + e.getMessage()));
        }
    }
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
            // Create user with Teacher role using Template Method pattern
            User newUser = teacherCreationTemplate.createUser(fname, lname, username, password, email, "Teacher", profileImage);
            
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
              // Get the existing teacher record that was created in the template
            Teacher teacher = teacherService.getTeacherByUserId(newUser.getUserId());
            if (teacher != null) {
                // Update only the subject taught
                teacher.setSubjectTaught(subjectTaught);
                teacherService.updateTeacher(teacher);
                
                // Update each subject to include this teacher in its teachersId array
                Integer teacherId = teacher.getTeacher_id();
                for (Integer subjectId : subjectTaught) {
                    subjectService.addTeacherToSubject(subjectId, teacherId);
                }
            }
            
            // Return response with teacher ID
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "User added successfully"
            ));
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to add teacher user: " + e.getMessage()));
        }
    }
    
}
