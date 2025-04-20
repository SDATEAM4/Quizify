package team4.quizify.service.report;

import java.util.List;
import java.util.Map;

public interface Report {
    
    /**
     * Generate a report that maps subjects to their associated teachers and student counts
     * @return Map with subject details, teachers list and student count
     */
    List<Map<String, Object>> generateSubjectTeacherStudentReport();
}
