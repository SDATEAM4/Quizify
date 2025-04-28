package team4.quizify.patterns.factory;

import java.util.List;
import java.util.Map;


public interface ReportFactory {
    Map<String, Object> generateReport(Integer id);
    List<Map<String, Object>> generateAllReports(Integer id);
}
