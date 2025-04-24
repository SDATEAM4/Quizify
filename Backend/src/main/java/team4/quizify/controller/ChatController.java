package team4.quizify.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team4.quizify.entity.Chat;
import team4.quizify.service.ChatService;

import java.util.List;

@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // 1. Get all students who sent a query to a teacher
    @GetMapping("/{teacherId}")
    public ResponseEntity<List<String>> getStudentsWhoSentQueries(@PathVariable Long teacherId) {
        List<String> studentNames = chatService.getStudentsWhoSentQueriesToTeacher(teacherId);
        return ResponseEntity.ok(studentNames);
    }

    // 2. Get all messages between teacher and student
    @GetMapping("/{teacherId}/{studentId}")
    public ResponseEntity<List<Chat>> getAllMessagesBetweenTeacherAndStudent(
            @PathVariable Long teacherId,
            @PathVariable Long studentId
    ) {
        return ResponseEntity.ok(chatService.getMessagesBetweenTeacherAndStudent(teacherId, studentId));
    }

    // 3. Post a message (send message)
    @PostMapping("/{teacherId}/{studentId}/message")
    public ResponseEntity<Chat> sendMessage(
            @PathVariable Long teacherId,
            @PathVariable Long studentId,
            @RequestBody Chat chat
    ) {
        chat.setSenderId(studentId);   // assuming student is sending
        chat.setReceiverId(teacherId); // assuming teacher is receiving
        return ResponseEntity.ok(chatService.sendMessage(chat));
    }

    // 4. Delete all messages between teacher and student
    @DeleteMapping("/{teacherId}/{studentId}")
    public ResponseEntity<Void> deleteMessagesBetweenTeacherAndStudent(
            @PathVariable Long teacherId,
            @PathVariable Long studentId
    ) {
        chatService.deleteMessagesBetweenTeacherAndStudent(teacherId, studentId);
        return ResponseEntity.ok().build();
    }

    // 5. Get unresolved query status
    @GetMapping("/{teacherId}/{studentId}/unresolved")
    public ResponseEntity<Boolean> isQueryUnresolved(
            @PathVariable Long teacherId,
            @PathVariable Long studentId
    ) {
        return ResponseEntity.ok(chatService.isQueryUnresolved(teacherId, studentId));
    }

    // 6. Get all teachers who taught a subject
    @GetMapping("/subjects")
    public ResponseEntity<List<String>> getTeachersBySubject(@RequestParam Integer subjectId) {
        return ResponseEntity.ok(chatService.getTeachersBySubject(subjectId));
    }

    // 7. Add unread status by teacher
    @PatchMapping("/{teacherId}/{studentId}/unreadbyTeacher")
    public ResponseEntity<Void> markUnreadByTeacher(
            @PathVariable Long teacherId,
            @PathVariable Long studentId
    ) {
        chatService.markUnreadByTeacher(teacherId, studentId);
        return ResponseEntity.ok().build();
    }

    // 8. Add unread status by student
    @PatchMapping("/{teacherId}/{studentId}/unreadbyStudent")
    public ResponseEntity<Void> markUnreadByStudent(
            @PathVariable Long teacherId,
            @PathVariable Long studentId
    ) {
        chatService.markUnreadByStudent(teacherId, studentId);
        return ResponseEntity.ok().build();
    }
}
