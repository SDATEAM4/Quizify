package team4.quizify.service;

import org.springframework.stereotype.Service;
import team4.quizify.entity.Question;
import team4.quizify.entity.QuestionBank;
import team4.quizify.repository.QuestionRepository;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final QuestionBankService questionBankService;

    public QuestionService(QuestionRepository questionRepository, QuestionBankService questionBankService) {
        this.questionRepository = questionRepository;
        this.questionBankService = questionBankService;
    }

    // Create a new question
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    // Get all questions
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }    // Get question by ID
    public Optional<Question> getQuestionById(Integer questionId) {
        return questionRepository.findById(questionId);
    }

    // Get questions by subject ID
    public List<Question> getQuestionsBySubjectId(Integer subjectId) {
        return questionRepository.findBySubjectId(subjectId);
    }

    // Get questions by difficulty level
    public List<Question> getQuestionsByLevel(Integer level) {
        return questionRepository.findByLevel(level);
    }

    // Get questions by subject ID and difficulty level
    public List<Question> getQuestionsBySubjectIdAndLevel(Integer subjectId, Integer level) {
        return questionRepository.findBySubjectIdAndLevel(subjectId, level);
    }

    // Update a question
    public Question updateQuestion(Question question) {
        return questionRepository.save(question);
    }    // Delete a question
    public void deleteQuestion(Integer questionId) {
        questionRepository.deleteById(questionId);
    }
    
    // Add a question to the appropriate question bank based on subject ID
    public void addQuestionToBank(Question question) {
        Integer subjectId = question.getSubjectId();
        Integer questionId = question.getQuestionId();
        
        // Find question banks for this subject
        List<QuestionBank> questionBanks = questionBankService.getQuestionBanksBySubjectId(subjectId);
        
        if (!questionBanks.isEmpty()) {
            // Add to the first question bank for this subject
            QuestionBank questionBank = questionBanks.get(0);
            questionBankService.addQuestionToBank(questionBank.getBankId(), questionId);
        } else {
            // Create a new question bank for this subject if none exists
            QuestionBank newQuestionBank = new QuestionBank();
            newQuestionBank.setSubjectId(subjectId);
            newQuestionBank = questionBankService.createQuestionBank(newQuestionBank);
            
            // Then add the question to the newly created bank
            questionBankService.addQuestionToBank(newQuestionBank.getBankId(), questionId);
        }
    }
}
