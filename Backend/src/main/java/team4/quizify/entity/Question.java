package team4.quizify.entity;

import jakarta.persistence.*;
import java.util.Arrays;
import java.util.Objects;

@Entity
@Table(name = "question")
public class Question {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer questionId;
    
    @Column(nullable = false)
    private String statement;
    
    private int marks;
    
    // Level: 1=easy, 2=medium, 3=hard
    private Integer level;
    
    @Column(name = "subject_id")
    private Integer subjectId;
    
    @Column(name = "correct_option")
    private String correctOption;
    
    @Column(columnDefinition = "text[]")
    private String[] options;

    // Default constructor
    public Question() {
    }

    // Parameterized constructor
    public Question(String statement, int marks, Integer level, Integer subjectId, String correctOption, String[] options) {
        this.statement = statement;
        this.marks = marks;
        this.level = level;
        this.subjectId = subjectId;
        this.correctOption = correctOption;
        this.options = options;
    }

    // Getters and Setters
    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }

    public String getStatement() {
        return statement;
    }

    public void setStatement(String statement) {
        this.statement = statement;
    }

    public int getMarks() {
        return marks;
    }

    public void setMarks(int marks) {
        this.marks = marks;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Integer getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Integer subjectId) {
        this.subjectId = subjectId;
    }

    public String getCorrectOption() {
        return correctOption;
    }

    public void setCorrectOption(String correctOption) {
        this.correctOption = correctOption;
    }

    public String[] getOptions() {
        return options;
    }

    public void setOptions(String[] options) {
        this.options = options;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Question question = (Question) o;
        return marks == question.marks &&
                Objects.equals(questionId, question.questionId) &&
                Objects.equals(statement, question.statement) &&
                Objects.equals(level, question.level) &&
                Objects.equals(subjectId, question.subjectId) &&
                Objects.equals(correctOption, question.correctOption) &&
                Arrays.equals(options, question.options);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(questionId, statement, marks, level, subjectId, correctOption);
        result = 31 * result + Arrays.hashCode(options);
        return result;
    }

    @Override
    public String toString() {
        return "Question{" +
                "questionId=" + questionId +
                ", statement='" + statement + '\'' +
                ", marks=" + marks +
                ", level=" + level +
                ", subjectId=" + subjectId +
                ", correctOption='" + correctOption + '\'' +
                ", options=" + Arrays.toString(options) +
                '}';
    }
}
