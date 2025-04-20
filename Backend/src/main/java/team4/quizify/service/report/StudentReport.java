package team4.quizify.service.report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team4.quizify.entity.Report;
import team4.quizify.entity.Quiz;
import team4.quizify.entity.Student;
import team4.quizify.entity.User;
import team4.quizify.repository.ReportRepository;
import team4.quizify.repository.StudentRepository;
import team4.quizify.repository.UserRepository;
import team4.quizify.service.QuizService;

import java.util.*;

@Service
public class StudentReport implements team4.quizify.service.report.Report {
    
    @Autowired
    private ReportRepository reportRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public List<Map<String, Object>> generateSubjectTeacherStudentReport() {
        // This is just implementing the interface method
        // Not actually used for student report functionality
        return new ArrayList<>();
    }
    
    /**
     * Generate a report for a student based on quiz ID
     * @param quizId The ID of the quiz
     * @param userId The ID of the student
     * @return Map with report details (obtained marks, total marks, etc.)
     */
    public Map<String, Object> generateStudentQuizReport(Integer quizId, Long userId) {
        Map<String, Object> reportData = new HashMap<>();
        
        // Get the report for this quiz and user
        List<Report> reports = reportRepository.findByQuizIdAndUserId(quizId, userId);
        
        if (reports.isEmpty()) {
            reportData.put("message", "No report found for this quiz and user");
            return reportData;
        }
        
        Report report = reports.get(0);
        
        // Get user details
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            reportData.put("studentName", user.getFname() + " " + user.getLname());
        }
        
        reportData.put("quizId", quizId);
        reportData.put("userId", userId);
        reportData.put("obtainedMarks", report.getObtainMarks());
        
        // Get quiz statistics
        Double avgMarks = reportRepository.getAverageMarksByQuizId(quizId);
        Integer maxMarks = reportRepository.getMaxMarksByQuizId(quizId);
        Integer minMarks = reportRepository.getMinMarksByQuizId(quizId);
        
        reportData.put("averageMarks", avgMarks != null ? avgMarks : 0);
        reportData.put("maxMarks", maxMarks != null ? maxMarks : 0);
        reportData.put("minMarks", minMarks != null ? minMarks : 0);
        
        return reportData;
    }
    
    /**
     * Generate a report for all quizzes taken by a student
     * @param userId The ID of the student
     * @return List of maps with report details for each quiz
     */
    public List<Map<String, Object>> generateStudentAllQuizzesReport(Long userId) {
        List<Map<String, Object>> reportData = new ArrayList<>();
        
        // Get all reports for this user
        List<Report> reports = reportRepository.findByUserId(userId);
        
        if (reports.isEmpty()) {
            Map<String, Object> emptyReport = new HashMap<>();
            emptyReport.put("message", "No reports found for this user");
            reportData.add(emptyReport);
            return reportData;
        }
        
        // Group reports by quiz ID
        Map<Integer, List<Report>> reportsByQuizId = new HashMap<>();
        for (Report report : reports) {
            Integer quizId = report.getQuizId();
            if (!reportsByQuizId.containsKey(quizId)) {
                reportsByQuizId.put(quizId, new ArrayList<>());
            }
            reportsByQuizId.get(quizId).add(report);
        }
        
        // Get user details
        Optional<User> userOptional = userRepository.findById(userId);
        String studentName = "";
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            studentName = user.getFname() + " " + user.getLname();
        }
        
        // Generate report for each quiz
        for (Map.Entry<Integer, List<Report>> entry : reportsByQuizId.entrySet()) {
            Integer quizId = entry.getKey();
            Report report = entry.getValue().get(0); // Take the first report for this quiz
            
            Map<String, Object> quizReport = new HashMap<>();
            quizReport.put("quizId", quizId);
            quizReport.put("studentName", studentName);
            quizReport.put("userId", userId);
            quizReport.put("obtainedMarks", report.getObtainMarks());
            
            // Get quiz statistics
            Double avgMarks = reportRepository.getAverageMarksByQuizId(quizId);
            Integer maxMarks = reportRepository.getMaxMarksByQuizId(quizId);
            Integer minMarks = reportRepository.getMinMarksByQuizId(quizId);
            
            quizReport.put("averageMarks", avgMarks != null ? avgMarks : 0);
            quizReport.put("maxMarks", maxMarks != null ? maxMarks : 0);
            quizReport.put("minMarks", minMarks != null ? minMarks : 0);
            
            reportData.add(quizReport);
        }
        
        return reportData;
    }
    
    /**
     * Generate a report for a specific quiz showing all student performances
     * @param quizId The ID of the quiz
     * @return Map with quiz statistics and list of student performances
     */
    public Map<String, Object> generateQuizReport(Integer quizId) {
        Map<String, Object> reportData = new HashMap<>();
        
        // Get all reports for this quiz
        List<Report> reports = reportRepository.findByQuizId(quizId);
        
        if (reports.isEmpty()) {
            reportData.put("message", "No reports found for this quiz");
            return reportData;
        }
        
        // Get quiz statistics
        Double avgMarks = reportRepository.getAverageMarksByQuizId(quizId);
        Integer maxMarks = reportRepository.getMaxMarksByQuizId(quizId);
        Integer minMarks = reportRepository.getMinMarksByQuizId(quizId);
        
        reportData.put("quizId", quizId);
        reportData.put("totalStudents", reports.size());
        reportData.put("averageMarks", avgMarks != null ? avgMarks : 0);
        reportData.put("maxMarks", maxMarks != null ? maxMarks : 0);
        reportData.put("minMarks", minMarks != null ? minMarks : 0);
        
        // List of student performances
        List<Map<String, Object>> studentPerformances = new ArrayList<>();
        for (Report report : reports) {
            Map<String, Object> performance = new HashMap<>();
            
            // Get user details
            Optional<User> userOptional = userRepository.findById(report.getUserId());
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                performance.put("studentName", user.getFname() + " " + user.getLname());
            }
            
            performance.put("userId", report.getUserId());
            performance.put("obtainedMarks", report.getObtainMarks());
            
            studentPerformances.add(performance);
        }
        
        reportData.put("studentPerformances", studentPerformances);
        
        return reportData;
    }
}
