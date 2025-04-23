package team4.quizify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team4.quizify.entity.Report;
import team4.quizify.entity.User;
import team4.quizify.entity.Quiz;
import team4.quizify.repository.ReportRepository;
import team4.quizify.repository.UserRepository;
import team4.quizify.repository.QuizRepository;

import java.util.*;

@Service
public class StudentReportService implements team4.quizify.service.Report {
    
    @Autowired
    private ReportRepository reportRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private QuizRepository quizDataRepository;
    
    @Override
    public List<Map<String, Object>> generateSubjectTeacherStudentReport() {
        return new ArrayList<>();
    }
    
    public Map<String, Object> generateStudentQuizReport(Integer quizId, Integer userId) {
        Map<String, Object> reportData = new HashMap<>();
        
        List<Report> reports = reportRepository.findByQuizIdAndUserId(quizId, userId);
        
        if (reports.isEmpty()) {
            reportData.put("message", "No report found for this quiz and user");
            return reportData;
        }
        
        Report report = reports.get(0);
        
        Optional<Quiz> quizData = quizDataRepository.findById(quizId);
        Integer totalMarks = quizData.isPresent() ? quizData.get().getMarks() : null;
        
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            reportData.put("studentName", user.getFname() + " " + user.getLname());
        }
        
        reportData.put("quizId", quizId);
        reportData.put("userId", userId);
        reportData.put("obtainedMarks", report.getObtainMarks());
        reportData.put("totalMarks", totalMarks);
        
        Double avgMarks = reportRepository.getAverageMarksByQuizId(quizId);
        Integer maxMarks = reportRepository.getMaxMarksByQuizId(quizId);
        Integer minMarks = reportRepository.getMinMarksByQuizId(quizId);
        
        reportData.put("averageMarks", avgMarks != null ? avgMarks : 0);
        reportData.put("maxMarks", maxMarks != null ? maxMarks : 0);
        reportData.put("minMarks", minMarks != null ? minMarks : 0);
        
        return reportData;
    }
    
    public List<Map<String, Object>> generateStudentAllQuizzesReport(Integer userId) {
        List<Map<String, Object>> reportData = new ArrayList<>();
        
        List<Report> reports = reportRepository.findByUserId(userId);
        
        if (reports.isEmpty()) {
            Map<String, Object> emptyReport = new HashMap<>();
            emptyReport.put("message", "No reports found for this user");
            reportData.add(emptyReport);
            return reportData;
        }
        
        Map<Integer, List<Report>> reportsByQuizId = new HashMap<>();
        for (Report report : reports) {
            Integer quizId = report.getQuizId();
            if (!reportsByQuizId.containsKey(quizId)) {
                reportsByQuizId.put(quizId, new ArrayList<>());
            }
            reportsByQuizId.get(quizId).add(report);
        }
        
        Optional<User> userOptional = userRepository.findById(userId);
        String studentName = "";
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            studentName = user.getFname() + " " + user.getLname();
        }
        
        for (Map.Entry<Integer, List<Report>> entry : reportsByQuizId.entrySet()) {
            Integer quizId = entry.getKey();
            Report report = entry.getValue().get(0);
            
            Optional<Quiz> quizData = quizDataRepository.findById(quizId);
            Integer totalMarks = quizData.isPresent() ? quizData.get().getMarks() : null;
            
            Map<String, Object> quizReport = new HashMap<>();
            quizReport.put("quizId", quizId);
            quizReport.put("studentName", studentName);
            quizReport.put("userId", userId);
            quizReport.put("obtainedMarks", report.getObtainMarks());
            quizReport.put("totalMarks", totalMarks);
            
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
    
    public Map<String, Object> generateQuizReport(Integer quizId) {
        Map<String, Object> reportData = new HashMap<>();
        
        List<Report> reports = reportRepository.findByQuizId(quizId);
        
        if (reports.isEmpty()) {
            reportData.put("message", "No reports found for this quiz");
            return reportData;
        }
        
        Optional<Quiz> quizData = quizDataRepository.findById(quizId);
        Integer totalMarks = quizData.isPresent() ? quizData.get().getMarks() : null;
        
        Double avgMarks = reportRepository.getAverageMarksByQuizId(quizId);
        Integer maxMarks = reportRepository.getMaxMarksByQuizId(quizId);
        Integer minMarks = reportRepository.getMinMarksByQuizId(quizId);
        
        reportData.put("quizId", quizId);
        reportData.put("totalMarks", totalMarks);
        reportData.put("totalStudents", reports.size());
        reportData.put("averageMarks", avgMarks != null ? avgMarks : 0);
        reportData.put("maxMarks", maxMarks != null ? maxMarks : 0);
        reportData.put("minMarks", minMarks != null ? minMarks : 0);
        
        List<Map<String, Object>> studentPerformances = new ArrayList<>();
        for (Report report : reports) {
            Map<String, Object> performance = new HashMap<>();
            
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
