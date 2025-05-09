package team4.quizify.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AdminReportService implements Report {

    @PersistenceContext
    private EntityManager entityManager;

    @SuppressWarnings("unchecked")
    @Override
    public List<Map<String, Object>> generateSubjectTeacherStudentReport() {
        List<Map<String, Object>> reportData = new ArrayList<>();

        // Custom query to fetch subjects
        Query subjectQuery = entityManager.createNativeQuery("SELECT subject_id, name FROM subject");
        List<Object[]> subjects = (List<Object[]>) subjectQuery.getResultList();

        // Custom query to fetch teachers with names
        Query teacherQuery = entityManager.createNativeQuery(
            "SELECT t.teacher_id, t.user_id, t.subject_taught, u.fname, u.lname " +
            "FROM teacher t " +
            "JOIN users u ON t.user_id = u.user_id"
        );
        List<Object[]> teachers = (List<Object[]>) teacherQuery.getResultList();

        // Custom query to fetch students
        Query studentQuery = entityManager.createNativeQuery("SELECT student_id, enrolled_subjects FROM student");
        List<Object[]> students = (List<Object[]>) studentQuery.getResultList();

        // Process each subject
        for (Object[] subjectRow : subjects) {
            Integer subjectId = ((Number) subjectRow[0]).intValue();
            String subjectName = (String) subjectRow[1];

            Map<String, Object> subjectReport = new HashMap<>();
            subjectReport.put("subjectId", subjectId);
            subjectReport.put("subjectName", subjectName);

            // Find teachers for this subject
            List<Map<String, Object>> teachersList = new ArrayList<>();
            for (Object[] teacherRow : teachers) {
                Integer teacherId = ((Number) teacherRow[0]).intValue();
                Integer userId = ((Number) teacherRow[1]).intValue();
                Integer[] subjectTaught = (Integer[]) teacherRow[2];
                String firstName = (String) teacherRow[3];
                String lastName = (String) teacherRow[4];

                if (subjectTaught != null && Arrays.asList(subjectTaught).contains(subjectId)) {
                    Map<String, Object> teacherInfo = new HashMap<>();
                    teacherInfo.put("teacherId", teacherId);
                    teacherInfo.put("userId", userId);
                    teacherInfo.put("name", firstName + " " + lastName);
                    teachersList.add(teacherInfo);
                }
            }
            subjectReport.put("teachers", teachersList);
            subjectReport.put("teacherCount", teachersList.size());

            // Count students enrolled in this subject
            int studentCount = 0;
            for (Object[] studentRow : students) {
                Integer[] enrolledSubjects = (Integer[]) studentRow[1];
                if (enrolledSubjects != null && Arrays.asList(enrolledSubjects).contains(subjectId)) {
                    studentCount++;
                }
            }
            subjectReport.put("studentCount", studentCount);

            // Add to report data
            reportData.add(subjectReport);
        }

        return reportData;
    }
}
