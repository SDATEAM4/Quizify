package team4.quizify.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import team4.quizify.entity.Quiz;

@Service
public class QuizService {

    private static final Logger logger = LoggerFactory.getLogger(QuizService.class);

    @Value("${openrouter.api.key}")
    private String apiKey;    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public List<Quiz> generateQuiz(String subject, String level, int numQuestions) {
        String url = "https://openrouter.ai/api/v1/chat/completions";
                
        // Creating headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("HTTP-Referer", "http://quizify-app.com");
        headers.set("X-Title", "Quizify");

          // Building the prompt
        String prompt = buildPrompt(subject, level, numQuestions);
        
          // Request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "qwen/qwen2.5-coder-7b-instruct");
        
        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);
        messages.add(message);
        
        requestBody.put("messages", messages);
        
        // Creating the request entity
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
        
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(url, requestEntity, Map.class);
            
            // Process the response
            List<Quiz> quizzes = parseQuizResponse(response);
            
            // Limit the number of questions if we got more than requested
            if (quizzes.size() > numQuestions) {
                return quizzes.subList(0, numQuestions);
            }
            
            return quizzes;
        } catch (Exception e) {
            throw e;
        }
    }
      private String buildPrompt(String subject, String level, int numQuestions) {
        String difficultyPrompt = level.equalsIgnoreCase("mix") ? 
                "mixed difficulty levels (easy, medium, and hard)" : 
                level.toLowerCase() + " difficulty level";
                
        return "I need " + numQuestions + " multiple-choice questions (MCQs) for the subject \"" + subject + 
               "\" with " + difficultyPrompt + ". Each question should have 4 options labeled a), b), c), and d). " +
               "I need the output in pure JSON format only (no explanation, no extra text, no markdown). " +
               "Each question object should include a question, options (as an object with keys a, b, c, d), " +
               "and answer (the correct option's key, like \"a\"). " +
               "This is for a project, so do not include any text like \"Here are your MCQs\" or \"Qx may need more clarification.\" " +
               "Just return the raw JSON.";
    }      private List<Quiz> parseQuizResponse(Map<String, Object> response) {
        List<Quiz> quizzes = new ArrayList<>();
                
        try {
            // Extracting the content from the response
            if (response == null) {
                return quizzes;
            }
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            if (choices == null || choices.isEmpty()) {
                return quizzes;
            }
            
            Map<String, Object> choice = choices.get(0);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> message = (Map<String, Object>) choice.get("message");
            if (message == null) {
                return quizzes;
            }
            
            String content = (String) message.get("content");
            if (content == null || content.isEmpty()) {
                return quizzes;
            }
                        
            // Try to clean the content in case it's not pure JSON
            content = cleanJsonContent(content);
            
            // Parse the JSON string to a list of Quiz objects
            quizzes = objectMapper.readValue(content, new TypeReference<List<Quiz>>() {});
        } catch (JsonProcessingException e) {
        } catch (Exception e) {
            logger.error("Error parsing quiz response", e);
        }
        
        return quizzes;
    }
    
    private String cleanJsonContent(String content) {
        // Sometimes the API might return JSON with extra text before or after
        // Try to extract just the JSON array part
        try {
            String trimmed = content.trim();
            int start = trimmed.indexOf('[');
            int end = trimmed.lastIndexOf(']') + 1;
            
            if (start >= 0 && end > start) {
                String jsonArrayPart = trimmed.substring(start, end);
                return jsonArrayPart;
            }
        } catch (Exception e) {
            logger.error("Error cleaning JSON content", e);
        }
        
        return content;
    }
}
