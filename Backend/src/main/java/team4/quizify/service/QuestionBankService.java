package team4.quizify.service;

import org.springframework.stereotype.Service;
import team4.quizify.entity.QuestionBank;
import team4.quizify.repository.QuestionBankRepository;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionBankService {

    private final QuestionBankRepository questionBankRepository;

    public QuestionBankService(QuestionBankRepository questionBankRepository) {
        this.questionBankRepository = questionBankRepository;
    }

    // Create a new question bank
    public QuestionBank createQuestionBank(QuestionBank questionBank) {
        return questionBankRepository.save(questionBank);
    }

    // Get all question banks
    public List<QuestionBank> getAllQuestionBanks() {
        return questionBankRepository.findAll();
    }    // Get question bank by ID
    public Optional<QuestionBank> getQuestionBankById(Integer bankId) {
        return questionBankRepository.findById(bankId);
    }

    // Get question banks by subject ID
    public List<QuestionBank> getQuestionBanksBySubjectId(Integer subjectId) {
        return questionBankRepository.findBySubjectId(subjectId);
    }

    // Update a question bank
    public QuestionBank updateQuestionBank(QuestionBank questionBank) {
        return questionBankRepository.save(questionBank);
    }    // Add question to question bank
    public QuestionBank addQuestionToBank(Integer bankId, Integer questionId) {
        Optional<QuestionBank> optionalQuestionBank = questionBankRepository.findById(bankId);
        if (optionalQuestionBank.isPresent()) {
            QuestionBank questionBank = optionalQuestionBank.get();
            questionBank.addQuestionId(questionId);
            return questionBankRepository.save(questionBank);
        }
        return null;
    }

    // Remove question from question bank
    public QuestionBank removeQuestionFromBank(Integer bankId, Integer questionId) {
        Optional<QuestionBank> optionalQuestionBank = questionBankRepository.findById(bankId);
        if (optionalQuestionBank.isPresent()) {
            QuestionBank questionBank = optionalQuestionBank.get();
            questionBank.removeQuestionId(questionId);
            return questionBankRepository.save(questionBank);
        }
        return null;
    }

    // Delete a question bank
    public void deleteQuestionBank(Integer bankId) {
        questionBankRepository.deleteById(bankId);
    }
}
