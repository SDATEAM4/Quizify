package team4.quizify.entity;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PracticeQuiz {
    private String question;
    private Map<String, String> options;
    private String answer;
    private String explanation;   // Explanation for the correct answer
}
