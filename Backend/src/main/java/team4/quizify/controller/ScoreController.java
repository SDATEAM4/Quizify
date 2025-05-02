package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team4.quizify.entity.Report;
import team4.quizify.entity.Student;
import team4.quizify.service.ReportService;
import team4.quizify.service.StudentService;
import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/Quizify/scores")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ScoreController {

    @Autowired
    private ReportService reportService;
    
    @Autowired
    private StudentService studentService;
    
    @PostMapping
    public ResponseEntity<?> submitQuizScore(@RequestBody Report report) {
        try {
            // Save the quiz score
            Report savedReport = reportService.saveQuizScore(report);
            
            // Update the student's attempted quizzes
            Student student = studentService.getStudentByUserId(report.getUserId());
            if (student != null) {
                // Get current attempted quizzes
                Integer[] currentAttemptedQuizzes = student.getAttemptedQuiz();
                
                // Check if quiz already attempted
                boolean quizAlreadyAttempted = false;
                if (currentAttemptedQuizzes != null) {
                    for (Integer quizId : currentAttemptedQuizzes) {
                        if (quizId != null && quizId.equals(report.getQuizId())) {
                            quizAlreadyAttempted = true;
                            break;
                        }
                    }
                }
                
                // If quiz not already attempted, add it to the array
                if (!quizAlreadyAttempted) {
                    Integer[] updatedAttemptedQuizzes;
                    
                    if (currentAttemptedQuizzes == null || currentAttemptedQuizzes.length == 0) {
                        updatedAttemptedQuizzes = new Integer[] { report.getQuizId() };
                    } else {
                        updatedAttemptedQuizzes = Arrays.copyOf(currentAttemptedQuizzes, currentAttemptedQuizzes.length + 1);
                        updatedAttemptedQuizzes[currentAttemptedQuizzes.length] = report.getQuizId();
                    }
                    
                    student.setAttemptedQuiz(updatedAttemptedQuizzes);
                    studentService.updateStudent(student);
                }
            }
            
            return ResponseEntity.status(HttpStatus.OK)
                .body(Map.of(
                    "message", "Score saved successfully",
                    "report_id", savedReport.getReportId(),
                    "quiz_id", report.getQuizId(), 
                    "points", report.getPoints()
                ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Can't save your score: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Internal error while saving score: " + e.getMessage()));
        }
    }
    
   
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getReportsByUserId(@PathVariable Integer userId) {
        try {
            return new ResponseEntity<>(reportService.getReportsByUserId(userId), HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error fetching user reports: " + e.getMessage()));
        }
    }
    
    
    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<?> getReportsByQuizId(@PathVariable Integer quizId) {
        try {
            return new ResponseEntity<>(reportService.getReportsByQuizId(quizId), HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error fetching quiz reports: " + e.getMessage()));
        }
    }
}
