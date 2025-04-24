package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import team4.quizify.service.AdminReportService;
import team4.quizify.service.StudentReportService;
import team4.quizify.service.TeacherReportService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/Quizify/reports")
@CrossOrigin("*")
public class ReportController {
    @Autowired
    private AdminReportService adminReport;
    
    @Autowired
    private StudentReportService studentReport;
    
    @Autowired
    private TeacherReportService teacherReport;
    
    //ADMIN REPORT NAMES OF TEACHERS AND NO OF STUDENTS BASED ON SUBJECT
    @GetMapping("/admin/subject-teacher-student")
    public ResponseEntity<List<Map<String, Object>>> getSubjectTeacherStudentReport() {
        return ResponseEntity.ok(adminReport.generateSubjectTeacherStudentReport());
    }
    
    //ALL STUDENTS REPORT BASED ON QUIZ ID
    @GetMapping("/student/{userId}/quiz/{quizId}")
    public ResponseEntity<Map<String, Object>> getStudentQuizReport(
            @PathVariable Integer quizId, 
            @PathVariable Integer userId) {
        return ResponseEntity.ok(studentReport.generateStudentQuizReport(quizId, userId));
    }
    
    //STUDENT REPORT BASED ON USER ID
    @GetMapping("/student/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getStudentAllQuizzesReport(
            @PathVariable Integer userId) {
        return ResponseEntity.ok(studentReport.generateStudentAllQuizzesReport(userId));
    }
    
    //QUIZ REPORT BASED ON QUIZ ID
    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<Map<String, Object>> getQuizReport(
            @PathVariable Integer quizId) {
        return ResponseEntity.ok(studentReport.generateQuizReport(quizId));
    }
    
    //TEACHER REPORT BASED ON QUIZ ID
    @GetMapping("/teacher/quiz/{quizId}")
    public ResponseEntity<Map<String, Object>> getTeacherQuizStatistics(
            @PathVariable Integer quizId) {
        return ResponseEntity.ok(teacherReport.generateQuizStatistics(quizId));
    }
}
