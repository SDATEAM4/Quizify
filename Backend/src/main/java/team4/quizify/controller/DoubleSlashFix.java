// Temporary file to show the code fix for the double slash issue
// You should add this code to AdminController.java

package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team4.quizify.entity.Teacher;
import team4.quizify.service.TeacherService;

import java.util.Map;

// Example class showing the fix
public class DoubleSlashFix {

    @Autowired
    private TeacherService teacherService;

    // Fix for double slash issue
    @DeleteMapping("//user/teacher/{userId}/{subjectId}")
public ResponseEntity<?> fixDoubleSlashTeacher(
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
        
        // Check if the array is empty or subjectId is not found
        if (currentSubjects == null || currentSubjects.length == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Teacher has no subjects taught"));
        }
        
        boolean found = false;
        for (Integer subject : currentSubjects) {
            if (subject.equals(subjectId)) {
                found = true;
                break;
            }
        }
        
        if (!found) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Subject not found in teacher's subjects taught"));
        }
        
        // Create a new array without the subject to remove
        Integer[] updatedSubjects = new Integer[currentSubjects.length - 1];
        int j = 0;
        for (Integer subject : currentSubjects) {
            if (!subject.equals(subjectId)) {
                updatedSubjects[j++] = subject;
            }
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
};
