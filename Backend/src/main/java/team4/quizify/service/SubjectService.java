package team4.quizify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team4.quizify.entity.Subject;
import team4.quizify.repository.SubjectRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;
    
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }
    
    public Optional<Subject> getSubjectById(Integer subjectId) {
        return subjectRepository.findById(subjectId);
    }
    
    public Subject saveSubject(Subject subject) {
        return subjectRepository.save(subject);
    }
    
    public void deleteSubject(Integer subjectId) {
        subjectRepository.deleteById(subjectId);
    }
    
    /**
     * Add a teacher to a subject's teachersId array
     * @param subjectId the ID of the subject
     * @param teacherId the ID of the teacher
     * @return the updated Subject
     */
    public Subject addTeacherToSubject(Integer subjectId, Integer teacherId) {
        Optional<Subject> subjectOpt = getSubjectById(subjectId);
        if (subjectOpt.isEmpty()) {
            return null;
        }
        
        Subject subject = subjectOpt.get();
        
        // Check if teacher already exists in the array
        Integer[] teachersId = subject.getTeachersId();
        if (teachersId != null) {
            // Check if teacher already exists in the array
            boolean teacherExists = Arrays.stream(teachersId)
                    .anyMatch(id -> id.equals(teacherId));
            
            if (!teacherExists) {
                // Add teacher to array
                List<Integer> teachersList = new ArrayList<>(Arrays.asList(teachersId));
                teachersList.add(teacherId);
                subject.setTeachersId(teachersList.toArray(new Integer[0]));
                return saveSubject(subject);
            }
        } else {
            // Create new array with the teacher ID
            subject.setTeachersId(new Integer[]{teacherId});
            return saveSubject(subject);
        }
        
        return subject;
    }
    
    /**
     * Remove a teacher from a subject's teachersId array
     * @param subjectId the ID of the subject
     * @param teacherId the ID of the teacher
     * @return the updated Subject
     */
    public Subject removeTeacherFromSubject(Integer subjectId, Integer teacherId) {
        Optional<Subject> subjectOpt = getSubjectById(subjectId);
        if (subjectOpt.isEmpty()) {
            return null;
        }
        
        Subject subject = subjectOpt.get();
        
        // Check if teachersId array exists
        Integer[] teachersId = subject.getTeachersId();
        if (teachersId != null && teachersId.length > 0) {
            // Filter out the teacher ID
            List<Integer> updatedTeachersList = Arrays.stream(teachersId)
                    .filter(id -> !id.equals(teacherId))
                    .collect(Collectors.toList());
            
            // Update the subject's teachersId array
            subject.setTeachersId(updatedTeachersList.toArray(new Integer[0]));
            return saveSubject(subject);
        }
        
        return subject;
    }
}
