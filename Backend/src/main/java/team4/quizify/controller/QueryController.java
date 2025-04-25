package team4.quizify.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import team4.quizify.entity.Query;
import team4.quizify.service.QueryService;

import java.util.List;

@RestController
@RequestMapping("/Quizify/chats")
@RequiredArgsConstructor
public class QueryController {

    private final QueryService queryService;

    @GetMapping("/unresolved")
    public List<Query> getUnresolvedQueries(@RequestParam int teacherId) {
        return queryService.getUnresolvedQueriesForTeacher(teacherId);
    }
}
