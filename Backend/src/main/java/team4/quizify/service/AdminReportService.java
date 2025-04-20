package team4.quizify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team4.quizify.entity.Student;
import team4.quizify.entity.Subject;
import team4.quizify.entity.Teacher;
import team4.quizify.entity.User;
import team4.quizify.repository.StudentRepository;
import team4.quizify.repository.SubjectRepository;
import team4.quizify.repository.TeacherRepository;

import java.util.*;

@Service
public class AdminReportService implements Report {
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private TeacherRepository teacherRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    
    @Override
    public List<Map<String, Object>> generateSubjectTeacherStudentReport() {
        List<Map<String, Object>> reportData = new ArrayList<>();
        
        // Get all subjects
        List<Subject> subjects = subjectRepository.findAll();
        
        // Get all teachers and students for efficiency
        List<Teacher> allTeachers = teacherRepository.findAll();
        List<Student> allStudents = studentRepository.findAll();
        
        // Process each subject
        for (Subject subject : subjects) {
            Map<String, Object> subjectReport = new HashMap<>();
            
            // Basic subject info
            subjectReport.put("subjectId", subject.getSubject_id());
            subjectReport.put("subjectName", subject.getName());
            
            // Find teachers who teach this subject
            List<Map<String, Object>> teachersList = new ArrayList<>();
            for (Teacher teacher : allTeachers) {
                if (teacher.getSubjectTaught() != null && containsId(teacher.getSubjectTaught(), subject.getSubject_id())) {                    User user = teacher.getUser();
                    Map<String, Object> teacherInfo = new HashMap<>();
                    teacherInfo.put("teacherId", teacher.getTeacher_id());
                    teacherInfo.put("name", user.getFname() + " " + user.getLname());
                    teachersList.add(teacherInfo);
                }
            }
            subjectReport.put("teachers", teachersList);
            subjectReport.put("teacherCount", teachersList.size());
            
            // Count students enrolled in this subject
            int studentCount = 0;
            for (Student student : allStudents) {
                if (student.getEnrolledSubjects() != null && containsId(student.getEnrolledSubjects(), subject.getSubject_id())) {
                    studentCount++;
                }
            }
            subjectReport.put("studentCount", studentCount);
            
            // Add to report data
            reportData.add(subjectReport);
        }
        
        return reportData;
    }
    
    
     // Helper method to check if an Integer array contains a specific Integer value 
    private boolean containsId(Integer[] array, Integer id) {
        if (array == null || array.length == 0) {
            return false;
        }
        
        for (Integer item : array) {
            if (item != null && item.equals(id)) {
                return true;
            }
        }
        
        return false;
    }
}
