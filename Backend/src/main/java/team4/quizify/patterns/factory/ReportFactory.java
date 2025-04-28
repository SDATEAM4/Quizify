package team4.quizify.patterns.factory;

import java.util.List;
import java.util.Map;

/**
 * Interface for Report Factory
 * Defines common operations for all report factories
 */
public interface ReportFactory {
    Map<String, Object> generateReport(Integer id);
    List<Map<String, Object>> generateAllReports(Integer id);
}
