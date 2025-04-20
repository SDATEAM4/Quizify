package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import team4.quizify.service.report.AdminReport;
import team4.quizify.service.report.StudentReport;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/Quizify/reports")
public class ReportController {
    
    @Autowired
    private AdminReport adminReport;
    
    @Autowired
    private StudentReport studentReport;
    
    @GetMapping("/admin/subject-teacher-student")
    public ResponseEntity<List<Map<String, Object>>> getSubjectTeacherStudentReport() {
        return ResponseEntity.ok(adminReport.generateSubjectTeacherStudentReport());
    }
    
    /**
     * Get report for a specific student and quiz
     * @param quizId ID of the quiz
     * @param userId ID of the user/student
     * @return Report data with obtained marks, total marks, avg, max, min
     */
    @GetMapping("/student/{userId}/quiz/{quizId}")
    public ResponseEntity<Map<String, Object>> getStudentQuizReport(
            @PathVariable Integer quizId, 
            @PathVariable Long userId) {
        return ResponseEntity.ok(studentReport.generateStudentQuizReport(quizId, userId));
    }
    
    /**
     * Get reports for all quizzes taken by a student
     * @param userId ID of the user/student
     * @return List of reports for each quiz taken
     */
    @GetMapping("/student/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getStudentAllQuizzesReport(
            @PathVariable Long userId) {
        return ResponseEntity.ok(studentReport.generateStudentAllQuizzesReport(userId));
    }
    
    /**
     * Get comprehensive report for a quiz showing all student performances
     * @param quizId ID of the quiz
     * @return Report with quiz statistics and list of student performances
     */
    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<Map<String, Object>> getQuizReport(
            @PathVariable Integer quizId) {
        return ResponseEntity.ok(studentReport.generateQuizReport(quizId));
    }
}
