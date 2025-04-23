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
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import team4.quizify.entity.PracticeQuiz;

@Service
public class QuizService {

    private static final Logger logger = LoggerFactory.getLogger(QuizService.class);
    
    @Value("${openrouter.api.key}")
    private String qwenApiKey;
    
    @Value("${openhands.api.key}")
    private String openHandsApiKey;
    
    @Value("${dolphin.api.key}")
    private String dolphinApiKey;
    
    @Value("${nvidia.api.key}")
    private String nvidiaApiKey;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<PracticeQuiz> generateQuiz(String subject, String topic, String description, String level, int numQuestions) {
        String url = "https://openrouter.ai/api/v1/chat/completions";
        String prompt = buildPrompt(subject, topic, description, level, numQuestions);
        
        // Create CompletableFuture for all API calls
        CompletableFuture<List<PracticeQuiz>> nvidiaFuture = CompletableFuture.supplyAsync(() -> 
            callOpenRouterApi(url, prompt, "nvidia/llama-3.1-nemotron-nano-8b-v1:free", nvidiaApiKey)
        );
        
        CompletableFuture<List<PracticeQuiz>> qwenFuture = CompletableFuture.supplyAsync(() -> 
            callOpenRouterApi(url, prompt, "qwen/qwen2.5-vl-3b-instruct:free", qwenApiKey)
        );
        
        CompletableFuture<List<PracticeQuiz>> openHandsFuture = CompletableFuture.supplyAsync(() -> 
            callOpenRouterApi(url, prompt, "all-hands/openhands-lm-32b-v0.1", openHandsApiKey)
        );
        
        CompletableFuture<List<PracticeQuiz>> dolphinFuture = CompletableFuture.supplyAsync(() -> 
            callOpenRouterApi(url, prompt, "cognitivecomputations/dolphin3.0-mistral-24b:free", dolphinApiKey)
        );        try {
            // Wait for all futures to complete with timeout
            CompletableFuture.allOf(nvidiaFuture, qwenFuture, openHandsFuture, dolphinFuture).get(30, TimeUnit.SECONDS);
            
            // Get results from each API
            List<PracticeQuiz> nvidiaQuiz = nvidiaFuture.getNow(new ArrayList<>());
            List<PracticeQuiz> qwenQuiz = qwenFuture.getNow(new ArrayList<>());
            List<PracticeQuiz> openHandsQuiz = openHandsFuture.getNow(new ArrayList<>());
            List<PracticeQuiz> dolphinQuiz = dolphinFuture.getNow(new ArrayList<>());
            
            // Log response status from each API
            logger.info("API Response Summary:");
            logger.info("NVIDIA API (Priority 1): {} questions", nvidiaQuiz.size());
            logger.info("Qwen API (Priority 2): {} questions", qwenQuiz.size());
            logger.info("OpenHands API (Priority 3): {} questions", openHandsQuiz.size());
            logger.info("Dolphin API (Priority 4): {} questions", dolphinQuiz.size());
            
            // Return the first non-empty result based on ranking
            if (!nvidiaQuiz.isEmpty()) {
                logger.info("Selected NVIDIA API response (Priority 1) - Returning {} questions", 
                    Math.min(nvidiaQuiz.size(), numQuestions));
                return nvidiaQuiz.size() > numQuestions ? nvidiaQuiz.subList(0, numQuestions) : nvidiaQuiz;
            }
            if (!qwenQuiz.isEmpty()) {
                logger.info("Selected Qwen API response (Priority 2) - Returning {} questions", 
                    Math.min(qwenQuiz.size(), numQuestions));
                return qwenQuiz.size() > numQuestions ? qwenQuiz.subList(0, numQuestions) : qwenQuiz;
            }
            if (!openHandsQuiz.isEmpty()) {
                logger.info("Selected OpenHands API response (Priority 3) - Returning {} questions", 
                    Math.min(openHandsQuiz.size(), numQuestions));
                return openHandsQuiz.size() > numQuestions ? openHandsQuiz.subList(0, numQuestions) : openHandsQuiz;
            }
            if (!dolphinQuiz.isEmpty()) {
                logger.info("Selected Dolphin API response (Priority 4) - Returning {} questions", 
                    Math.min(dolphinQuiz.size(), numQuestions));
                return dolphinQuiz.size() > numQuestions ? dolphinQuiz.subList(0, numQuestions) : dolphinQuiz;
            }
            
            logger.warn("No API returned valid questions - All APIs returned empty results");
            return new ArrayList<>();
            
        } catch (Exception e) {
            logger.error("Error getting responses from APIs", e);
            // Try to get any successful response if some APIs failed
            try {
                List<PracticeQuiz> nvidiaQuiz = nvidiaFuture.getNow(new ArrayList<>());
                if (!nvidiaQuiz.isEmpty()) return nvidiaQuiz;
                
                List<PracticeQuiz> qwenQuiz = qwenFuture.getNow(new ArrayList<>());
                if (!qwenQuiz.isEmpty()) return qwenQuiz;
                
                List<PracticeQuiz> openHandsQuiz = openHandsFuture.getNow(new ArrayList<>());
                if (!openHandsQuiz.isEmpty()) return openHandsQuiz;
                
                List<PracticeQuiz> dolphinQuiz = dolphinFuture.getNow(new ArrayList<>());
                if (!dolphinQuiz.isEmpty()) return dolphinQuiz;
                
            } catch (Exception ex) {
                logger.error("All APIs failed", ex);
            }
            return new ArrayList<>();
        }
    }
    
  
    private List<PracticeQuiz> callOpenRouterApi(String url, String prompt, String model, String apiKey) {
        try {
            // Creating headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            headers.set("HTTP-Referer", "http://quizify-app.com");
            headers.set("X-Title", "Quizify");
            
            // Request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            
            List<Map<String, String>> messages = new ArrayList<>();
            Map<String, String> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);
            messages.add(message);
            
            requestBody.put("messages", messages);
            
            // Creating the request entity
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(url, requestEntity, Map.class);
            
            return parseQuizResponse(response);
        } catch (Exception e) {
            logger.error("Error calling OpenRouter API with model: " + model, e);
            return new ArrayList<>();
        }
    }
    
 
    private String buildPrompt(String subject, String topic,String description ,String level, int numQuestions) {
        String difficultyPrompt = level.equalsIgnoreCase("mix") ? 
                "mixed difficulty levels (easy, medium, and hard)" : 
                level.toLowerCase() + " difficulty level";
                
        return "I need " + numQuestions + " multiple-choice questions (MCQs) for the subject \"" + subject + 
               "\" with " + difficultyPrompt + "difficulty level and my topic is " + topic + "and the description of subject is " +description + ". Each question should have 4 options labeled a), b), c), and d). " +
               "I need the output in pure JSON format only (no explanation, no extra text, no markdown). " +
               "Each question object should include a question, options (as an object with keys a, b, c, d), " +
               "and answer (the correct option's key, like \"a\"). and with explaination of why that answer is correct in one line without any extra information."+
               "This is for a project, so do not include any text like \"Here are your MCQs\" or \"Qx may need more clarification.\" " +
               "Just return the raw JSON.";
    }      
    
  
    private List<PracticeQuiz> parseQuizResponse(Map<String, Object> response) {
        List<PracticeQuiz> quizzes = new ArrayList<>();
                
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
            quizzes = objectMapper.readValue(content, new TypeReference<List<PracticeQuiz>>() {});
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
