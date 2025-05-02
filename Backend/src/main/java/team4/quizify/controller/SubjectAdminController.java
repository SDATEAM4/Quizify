package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import team4.quizify.entity.Subject;
import team4.quizify.entity.Student;
import team4.quizify.entity.Teacher;
import team4.quizify.entity.User;
import team4.quizify.service.SubjectService;
import team4.quizify.service.CloudinaryService;
import team4.quizify.service.StudentService;
import team4.quizify.service.TeacherService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/Quizify/admin/subjects")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class SubjectAdminController {   
    @Autowired
    private SubjectService subjectService;
    
    @Autowired
    private CloudinaryService cloudinaryService;
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private TeacherService teacherService;
   
    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }
    
    
    @GetMapping("/{subjectId}")
    public ResponseEntity<?> getSubjectById(@PathVariable Integer subjectId) {
        Optional<Subject> subject = subjectService.getSubjectById(subjectId);
        if (subject.isPresent()) {
            return ResponseEntity.ok(subject.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Subject not found"));
        }
    }
    

    @PostMapping
    public ResponseEntity<?> addSubject(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "subjectImage", required = false) MultipartFile subjectImage) {
        try {
            // Create new subject entity
            Subject subject = new Subject();
            subject.setName(name);
            subject.setDescription(description);
            
            // Handle image upload if provided
            if (subjectImage != null && !subjectImage.isEmpty()) {
                String imageUrl = cloudinaryService.uploadFile(subjectImage);
                subject.setImageUrl(imageUrl);
            }
            
            // Initialize with empty teachers array
            subject.setTeachersId(new Integer[0]);
            
            // Save the subject
             subjectService.saveSubject(subject);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                        "message", "Subject added successfully"
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to add subject"));
        }
    }
     

    @PutMapping("/{subjectId}")
    public ResponseEntity<?> updateSubject(
            @PathVariable Integer subjectId,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "subjectImage", required = false) MultipartFile subjectImage) {
        try {
            // Get existing subject
            Optional<Subject> existingSubjectOpt = subjectService.getSubjectById(subjectId);
            if (!existingSubjectOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Subject not found"));
            }
            
            Subject existingSubject = existingSubjectOpt.get();
            
            // Update name if provided
            if (name != null && !name.isEmpty()) {
                existingSubject.setName(name);
            }
            
            // Update description if provided
            if (description != null) {
                existingSubject.setDescription(description);
            }
            
            // Update image if provided
            if (subjectImage != null && !subjectImage.isEmpty()) {
                String imageUrl = cloudinaryService.uploadFile(subjectImage);
                existingSubject.setImageUrl(imageUrl);
            }
              // Save the updated subject
            subjectService.saveSubject(existingSubject);
            
            return ResponseEntity.ok(Map.of(
                "message", "Subject updated successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update subject"));
        }
    }
    
  
    @PutMapping("/overwrite-user-subjects")
    public ResponseEntity<?> overwriteUserSubjects(
            @RequestParam("userId") Integer userId,
            @RequestParam("subjects") String subjectsStr) {
        try {
            // Parse the subjects string into an array of integers
            Integer[] subjectIds;
            if (subjectsStr != null && !subjectsStr.isEmpty()) {
                String[] subjectStrings = subjectsStr.split(",");
                subjectIds = new Integer[subjectStrings.length];
                for (int i = 0; i < subjectStrings.length; i++) {
                    subjectIds[i] = Integer.parseInt(subjectStrings[i].trim());
                }
            } else {
                subjectIds = new Integer[0];
            }
            
            // Check if user is a student or teacher
            Student student = studentService.getStudentByUserId(userId);
            if (student != null) {
                // User is a student, update enrolled subjects
                student.setEnrolledSubjects(subjectIds);
                studentService.updateStudent(student);
                return ResponseEntity.ok(Map.of(
                    "message", "Student enrolled subjects updated successfully"
                ));
            }            Teacher teacher = teacherService.getTeacherByUserId(userId);
            if (teacher != null) {
                // Get the old subjects taught by teacher
                Integer[] oldSubjectIds = teacher.getSubjectTaught();
                List<Integer> oldSubjectsList = oldSubjectIds != null ? 
                        Arrays.asList(oldSubjectIds) : new ArrayList<>();
                
                List<Integer> newSubjectsList = Arrays.asList(subjectIds);
                
                // User is a teacher, update subjects taught
                teacher.setSubjectTaught(subjectIds);
                teacherService.updateTeacher(teacher);
                
                // Update the subjects' teachersId arrays
                Integer teacherId = teacher.getTeacher_id();
                
                // Add the teacher to the new subjects
                for (Integer subjectId : subjectIds) {
                    subjectService.addTeacherToSubject(subjectId, teacherId);
                }
                
                // Remove the teacher from subjects they're no longer teaching
                for (Integer oldSubjectId : oldSubjectsList) {
                    if (!newSubjectsList.contains(oldSubjectId)) {
                        subjectService.removeTeacherFromSubject(oldSubjectId, teacherId);
                    }
                }
                
                return ResponseEntity.ok(Map.of(
                    "message", "Teacher subjects taught updated successfully"
                ));
            }
            
            // User not found or not a student/teacher
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found or not a student/teacher"));
                
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid subject ID format"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update user subjects: " + e.getMessage()));
        }
    }
   
    @DeleteMapping("/{subjectId}")
    public ResponseEntity<?> deleteSubject(@PathVariable Integer subjectId) {
        try {
            // Check if subject exists
            Optional<Subject> subject = subjectService.getSubjectById(subjectId);
            if (!subject.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Subject not found"));
            }
            
            // Delete the subject
            subjectService.deleteSubject(subjectId);
            
            return ResponseEntity.ok(Map.of("message", "Subject deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete subject"));
        }
    }
    
   
    @GetMapping("/{subjectId}/teachers")
    public ResponseEntity<?> getTeachersOfSubject(@PathVariable Integer subjectId) {
        try {
            // Check if subject exists
            Optional<Subject> subjectOpt = subjectService.getSubjectById(subjectId);
            if (subjectOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Subject not found"));
            }
            
            Subject subject = subjectOpt.get();
            Integer[] teacherIds = subject.getTeachersId();
            
            // If no teachers assigned to this subject
            if (teacherIds == null || teacherIds.length == 0) {
                return ResponseEntity.ok(List.of());
            }
            
            // Retrieve teacher details for each teacher ID
            List<Map<String, Object>> teacherDetails = new ArrayList<>();
            for (Integer teacherId : teacherIds) {
                Teacher teacher = teacherService.getTeacherByTeacherId(teacherId);
                if (teacher != null) {
                    User user = teacher.getUser();                    Map<String, Object> teacherData = Map.of(
                        "teacherId", teacher.getTeacher_id(),
                        "userId", user.getUserId(),
                        "firstName", user.getFname(),
                        "lastName", user.getLname(),
                        "username", user.getUsername()
                    );
                    teacherDetails.add(teacherData);
                }
            }
            
            return ResponseEntity.ok(teacherDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve subject teachers: " + e.getMessage()));
        }
    }
}
