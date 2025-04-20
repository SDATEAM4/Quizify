package team4.quizify.service;

import java.util.List;
import java.util.Map;

public interface Report {
    List<Map<String, Object>> generateSubjectTeacherStudentReport();
}
