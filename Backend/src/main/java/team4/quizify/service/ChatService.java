package team4.quizify.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import team4.quizify.entity.Chat;
import team4.quizify.entity.Query;
import team4.quizify.repository.ChatRepository;
import team4.quizify.repository.QueryRepository;
import team4.quizify.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final QueryRepository queryRepository;
    private final UserRepository userRepository;

    public List<Chat> getChatsForUser(Long userId) {
        return chatRepository.findBySenderIdOrReceiverId(userId, userId);
    }

    public Chat sendMessage(Chat chat) {
        chat.setTimestamp(java.time.LocalDateTime.now());
        return chatRepository.save(chat);
    }

    public List<Chat> getMessagesInChat(Long senderId, Long receiverId) {
        return chatRepository.findByTeacherAndStudent(receiverId, senderId);
    }

    public void deleteChat(Long chatId) {
        chatRepository.deleteById(chatId);
    }

    public List<String> getStudentsWhoSentQueriesToTeacher(Long teacherId) {
        List<Chat> chats = chatRepository.findByReceiverId(teacherId);
        return chats.stream()
                .map(chat -> userRepository.findById(chat.getSenderId())
                        .map(user -> user.getFname() + " " + user.getLname())
                        .orElse("Unknown"))
                .distinct()
                .collect(Collectors.toList());
    }

    // ✅ For: GET /chats/{teacherId}/{studentId}
    public List<Chat> getMessagesBetweenTeacherAndStudent(Long teacherId, Long studentId) {
        return chatRepository.findByTeacherAndStudent(teacherId, studentId);
    }

    // ✅ For: DELETE /chats/{teacherId}/{studentId}
    public void deleteMessagesBetweenTeacherAndStudent(Long teacherId, Long studentId) {
        List<Chat> messages = chatRepository.findByTeacherAndStudent(teacherId, studentId);
        chatRepository.deleteAll(messages);
    }

    // ✅ For: GET /chats/{teacherId}/{studentId}/unresolved
    public boolean isQueryUnresolved(Long teacherId, Long studentId) {
        List<Query> queries = queryRepository.findByReceiverIdAndResolveStatusFalse(teacherId);
        return queries.stream().anyMatch(query -> query.getSenderId().equals(studentId));
    }

    // ✅ For: GET /chats/subjects?subjectId=2
    public List<String> getTeachersBySubject(Integer subjectId) {
        List<Chat> chats = chatRepository.findBySubjectId(subjectId);
        return chats.stream()
                .map(chat -> userRepository.findById(chat.getReceiverId())
                        .map(user -> user.getFname() + " " + user.getLname())
                        .orElse("Unknown"))
                .distinct()
                .collect(Collectors.toList());
    }

    // ✅ For: PATCH /chats/{teacherId}/{studentId}/unreadbyTeacher
    public void markUnreadByTeacher(Long teacherId, Long studentId) {
        List<Chat> chats = chatRepository.findByTeacherAndStudent(teacherId, studentId);
        for (Chat chat : chats) {
            // Let's pretend we added an unreadByTeacher flag — simulate here
            // chat.setUnreadByTeacher(true);
            chatRepository.save(chat);
        }
    }

    // ✅ For: PATCH /chats/{teacherId}/{studentId}/unreadbyStudent
    public void markUnreadByStudent(Long teacherId, Long studentId) {
        List<Chat> chats = chatRepository.findByTeacherAndStudent(teacherId, studentId);
        for (Chat chat : chats) {
            // Similarly simulate an unreadByStudent field
            // chat.setUnreadByStudent(true);
            chatRepository.save(chat);
        }
    }
}
