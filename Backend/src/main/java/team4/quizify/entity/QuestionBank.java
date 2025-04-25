package team4.quizify.entity;

import jakarta.persistence.*;
import java.util.Arrays;
import java.util.Objects;

@Entity
@Table(name = "question_bank")
public class QuestionBank {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bank_id")
    private Integer bankId;
    
    @Column(name = "subject_id")
    private Integer subjectId;
    
    @Column(name = "question_ids", columnDefinition = "integer[]")
    private Integer[] questionIds;

    // Default constructor
    public QuestionBank() {
    }

    // Parameterized constructor
    public QuestionBank(Integer subjectId, Integer[] questionIds) {
        this.subjectId = subjectId;
        this.questionIds = questionIds;
    }

    // Getters and Setters
    public Integer getBankId() {
        return bankId;
    }

    public void setBankId(Integer bankId) {
        this.bankId = bankId;
    }

    public Integer getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Integer subjectId) {
        this.subjectId = subjectId;
    }

    public Integer[] getQuestionIds() {
        return questionIds;
    }

    public void setQuestionIds(Integer[] questionIds) {
        this.questionIds = questionIds;
    }

    // Helper method to add a question ID to the array
    public void addQuestionId(Integer questionId) {
        if (questionIds == null) {
            questionIds = new Integer[]{questionId};
        } else {
            Integer[] newQuestionIds = Arrays.copyOf(questionIds, questionIds.length + 1);
            newQuestionIds[questionIds.length] = questionId;
            this.questionIds = newQuestionIds;
        }
    }

    // Helper method to remove a question ID from the array
    public void removeQuestionId(Integer questionId) {
        if (questionIds == null || questionIds.length == 0) {
            return;
        }

        int index = -1;
        for (int i = 0; i < questionIds.length; i++) {
            if (questionIds[i].equals(questionId)) {
                index = i;
                break;
            }
        }

        if (index != -1) {
            Integer[] newQuestionIds = new Integer[questionIds.length - 1];
            System.arraycopy(questionIds, 0, newQuestionIds, 0, index);
            System.arraycopy(questionIds, index + 1, newQuestionIds, index, questionIds.length - index - 1);
            this.questionIds = newQuestionIds;
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        QuestionBank that = (QuestionBank) o;
        return Objects.equals(bankId, that.bankId) &&
                Objects.equals(subjectId, that.subjectId) &&
                Arrays.equals(questionIds, that.questionIds);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(bankId, subjectId);
        result = 31 * result + Arrays.hashCode(questionIds);
        return result;
    }

    @Override
    public String toString() {
        return "QuestionBank{" +
                "bankId=" + bankId +
                ", subjectId=" + subjectId +
                ", questionIds=" + Arrays.toString(questionIds) +
                '}';
    }
}
