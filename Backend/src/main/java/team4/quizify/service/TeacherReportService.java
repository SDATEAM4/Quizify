package team4.quizify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team4.quizify.entity.Quiz;
import team4.quizify.entity.Report;
import team4.quizify.entity.Subject;
import team4.quizify.entity.Teacher;
import team4.quizify.repository.QuizRepository;
import team4.quizify.repository.ReportRepository;
import team4.quizify.repository.SubjectRepository;
import team4.quizify.repository.TeacherRepository;

import java.util.*;

@Service
public class TeacherReportService {
    @Autowired
    private ReportRepository reportRepository;
      @Autowired
    private QuizRepository quizDataRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private TeacherRepository teacherRepository;
    
    public List<Map<String, Object>> generateSubjectTeacherStudentReport() {
        return new ArrayList<>();
    }
    
    // Method to generate a report for a specific quiz
    public Map<String, Object> generateQuizStatistics(Integer quizId) {
        Map<String, Object> statistics = new HashMap<>();
        
        // Check if the quiz exists
        Optional<Quiz> quizDataOptional = quizDataRepository.findById(quizId);
        if (quizDataOptional.isEmpty()) {
            statistics.put("error", "Quiz not found");
            return statistics;
        }
        
        Quiz quizData = quizDataOptional.get();
        
        // Get all reports for the quiz
        List<Report> reports = reportRepository.findByQuizId(quizId);
          if (reports.isEmpty()) {
            // Get subject name
            Integer subjectId = quizData.getSubjectId();
            String subjectName = "Unknown Subject";
            Optional<Subject> subjectOptional = subjectRepository.findById(subjectId);
            if (subjectOptional.isPresent()) {
                subjectName = subjectOptional.get().getName();
            }
            
            statistics.put("quizId", quizId);
            statistics.put("type", quizData.getType());
            statistics.put("quizName", quizData.getTitle()); 
            statistics.put("totalMarks", quizData.getMarks());
            statistics.put("message", "No students have attempted this quiz yet.");
            statistics.put("totalAttempts", 0);
            statistics.put("averageMarks", 0);
            statistics.put("maximumMarks", 0);
            statistics.put("minimumMarks", 0);
            statistics.put("subjectId", subjectId);
            statistics.put("subjectName", subjectName);
            statistics.put("title", quizData.getTitle());
            statistics.put("description", quizData.getDescription());
            statistics.put("level", quizData.getLevel());
            statistics.put("timeLimit", quizData.getTimelimit());
            return statistics;
        }
          // Get total number of students who attempted
        int totalAttempts = reports.size();
        
        // Calculate statistics
        Double averageMarks = reportRepository.getAverageMarksByQuizId(quizId);
        Integer maxMarks = reportRepository.getMaxMarksByQuizId(quizId);
        Integer minMarks = reportRepository.getMinMarksByQuizId(quizId);          // Get subject name
        Integer subjectId = quizData.getSubjectId();
        String subjectName = "Unknown Subject";
        Optional<Subject> subjectOptional = subjectRepository.findById(subjectId);
        if (subjectOptional.isPresent()) {
            subjectName = subjectOptional.get().getName();
        }
        
        // Build response - explicitly add quizId first to ensure it's always included
        statistics.put("quizId", quizId);
        statistics.put("type", quizData.getType()); 
        statistics.put("quizName", quizData.getTitle());
        statistics.put("totalMarks", quizData.getMarks());
        statistics.put("totalAttempts", totalAttempts);
        statistics.put("averageMarks", averageMarks != null ? averageMarks : 0);
        statistics.put("maximumMarks", maxMarks != null ? maxMarks : 0);
        statistics.put("minimumMarks", minMarks != null ? minMarks : 0);
        statistics.put("level", quizData.getLevel());
        statistics.put("timeLimit", quizData.getTimelimit());
        statistics.put("subjectId", subjectId);
        statistics.put("subjectName", subjectName);
        statistics.put("description", quizData.getDescription());
        
        return statistics;
    }
    
    // Method to generate reports for all quizzes created by a teacher
    public List<Map<String, Object>> generateTeacherAllQuizzesReport(Integer teacherId) {
        List<Map<String, Object>> allQuizReports = new ArrayList<>();
        
        // Find the teacher by ID
        Optional<Teacher> teacherOptional = teacherRepository.findById(teacherId);
        if (teacherOptional.isEmpty()) {
            Map<String, Object> errorReport = new HashMap<>();
            errorReport.put("error", "Record not found");
            allQuizReports.add(errorReport);
            return allQuizReports;
        }
        
        Teacher teacher = teacherOptional.get();
        Integer[] createdQuizIds = teacher.getCreatedQuiz();
        
        // If teacher hasn't created any quizzes
        if (createdQuizIds == null || createdQuizIds.length == 0) {
            Map<String, Object> emptyReport = new HashMap<>();
            emptyReport.put("message", "No quizzes created by this teacher");
            allQuizReports.add(emptyReport);
            return allQuizReports;
        }
        
        // Get reports for each quiz
        for (Integer quizId : createdQuizIds) {
            Map<String, Object> quizReport = generateQuizStatistics(quizId);
            allQuizReports.add(quizReport);
        }
        
        return allQuizReports;
    }
}
