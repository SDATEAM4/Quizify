package team4.quizify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import team4.quizify.patterns.factory.AdminReportFactory;
import team4.quizify.patterns.factory.ReportFactory;
import team4.quizify.patterns.factory.ReportFactoryProducer;
import team4.quizify.patterns.factory.StudentReportFactory;
import team4.quizify.patterns.factory.TeacherReportFactory;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/Quizify/reports")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ReportController {
    @Autowired
    private ReportFactoryProducer reportFactoryProducer;
    
    @Autowired
    private AdminReportFactory adminReportFactory;
    
    @Autowired
    private StudentReportFactory studentReportFactory;
    
    @Autowired
    private TeacherReportFactory teacherReportFactory;
    
    //ADMIN REPORT NAMES OF TEACHERS AND NO OF STUDENTS BASED ON SUBJECT
    @GetMapping("/admin/subject-teacher-student")
    public ResponseEntity<List<Map<String, Object>>> getSubjectTeacherStudentReport() {
        // Use the admin report factory
        return ResponseEntity.ok(adminReportFactory.generateSubjectTeacherStudentReport());
    }
    
    //ALL STUDENTS REPORT BASED ON QUIZ ID
    @GetMapping("/student/{userId}/quiz/{quizId}")
    public ResponseEntity<Map<String, Object>> getStudentQuizReport(
            @PathVariable Integer quizId, 
            @PathVariable Integer userId) {
        // Use the student report factory
        return ResponseEntity.ok(studentReportFactory.generateStudentQuizReport(quizId, userId));
    }
    
    //STUDENT REPORT BASED ON USER ID
    @GetMapping("/student/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getStudentAllQuizzesReport(
            @PathVariable Integer userId) {
        // Get student factory from producer and generate report
        ReportFactory reportFactory = reportFactoryProducer.getFactory("Student");
        return ResponseEntity.ok(reportFactory.generateAllReports(userId));
    }
    
    //QUIZ REPORT BASED ON QUIZ ID
    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<Map<String, Object>> getQuizReport(
            @PathVariable Integer quizId) {
        // Use the student report factory directly
        return ResponseEntity.ok(studentReportFactory.generateReport(quizId));
    }
    
    //TEACHER REPORT BASED ON QUIZ ID
    @GetMapping("/teacher/quiz/{quizId}")
    public ResponseEntity<Map<String, Object>> getTeacherQuizStatistics(
            @PathVariable Integer quizId) {
        // Use the teacher report factory directly
        return ResponseEntity.ok(teacherReportFactory.generateReport(quizId));
    }
    
    //TEACHER REPORT FOR ALL CREATED QUIZZES BASED ON TEACHER ID
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Map<String, Object>>> getTeacherAllQuizzesReport(
            @PathVariable Integer teacherId) {
        // Get teacher factory from producer and generate report
        ReportFactory reportFactory = reportFactoryProducer.getFactory("Teacher");
        return ResponseEntity.ok(reportFactory.generateAllReports(teacherId));
    }    
    
    //STUDENT QUIZ MARKS DISTRIBUTION REPORT BASED ON STUDENT ID
    @GetMapping("/student/distribution/{user_id}")
    public ResponseEntity<Map<String, Object>> getStudentQuizMarkDistributionReport(
            @PathVariable("user_id") Integer userId) {
        // Use the student report factory directly
        return ResponseEntity.ok(studentReportFactory.generateMarkDistributionReport(userId));
    }
}
