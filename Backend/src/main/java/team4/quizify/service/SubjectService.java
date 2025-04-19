package team4.quizify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import team4.quizify.entity.Subject;
import team4.quizify.repository.SubjectRepository;

import java.util.List;
import java.util.Optional;

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
}
