import React from "react";
import { TeacherNavbar } from "../components/teacherNavbar";
import { useAuth } from "../context/authContext";
import { useQuizReports } from "../components/useQuizReport";
import ReportNavigation from "../components/reportNavigation";
import QuizInfoCard from "../components/quizInfoCard";
import StatisticalOverviewChart from "../components/stasticalOverview";
import ScoreDistributionChart from "../components/scoreDistribution";
import QuizStatsSummary from "../components/quizStat";
import LoadingSpinner from "../components/loadingSpinner";
import NoDataMessage from "../components/noDataMessage";

const TeacherReports = () => {
  const { teacherId } = useAuth();
  const [currentQuizIndex, setCurrentQuizIndex] = React.useState(0);
  const {
    quizzes,
    reportData,
    allReportsData,
    loading,
    loadingReports,
    scoreDistributionData,
    passFailData,
    timeSpentData,
    fetchAllQuizReports,
  } = useQuizReports(teacherId);

  React.useEffect(() => {
    document.title = "Quizify - Teacher Reports";
  }, []);

  // Navigate to the previous quiz report
  const handlePreviousReport = () => {
    if (currentQuizIndex > 0) {
      const newIndex = currentQuizIndex - 1;
      setCurrentQuizIndex(newIndex);
      updateReportData(newIndex);
    }
  };

  // Navigate to the next quiz report
  const handleNextReport = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      const newIndex = currentQuizIndex + 1;
      setCurrentQuizIndex(newIndex);
      updateReportData(newIndex);
    }
  };

  // Update report data when navigating between quizzes
  const updateReportData = (index) => {
    if (quizzes.length > 0) {
      const quizId = quizzes[index].quiz_id;
      const quizReport = allReportsData[quizId];
      if (quizReport) {
        // This function is provided by the hook and updates all the relevant state
        fetchAllQuizReports.updateCurrentReport(quizReport);
      }
    }
  };

  // Get current quiz info
  const getCurrentQuizInfo = () => {
    if (quizzes.length === 0) return { title: "No quizzes found", subject: "" };
    const currentQuiz = quizzes[currentQuizIndex];
    return {
      title:
        currentQuiz.title ||
        reportData?.quizName ||
        currentQuiz.type ||
        "Untitled Quiz",
      subject:
        currentQuiz.subject_name ||
        reportData?.subjectName ||
        "Unknown Subject",
      quizId: currentQuiz.quiz_id,
    };
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <div className="w-full">
        <TeacherNavbar />
      </div>
      <div className="bg-gray-100 p-6 flex-grow">
        <div className="max-w-6xl mx-auto">
          <ReportNavigation
            totalQuizzes={quizzes.length}
            currentIndex={currentQuizIndex}
            onPrevious={handlePreviousReport}
            onNext={handleNextReport}
          />
          {loading ? (
            <LoadingSpinner />
          ) : quizzes.length === 0 ? (
            <NoDataMessage message="No quizzes found for this teacher." />
          ) : (
            <>
              <QuizInfoCard
                reportData={reportData}
                quizInfo={getCurrentQuizInfo()}
              />
              {loadingReports ? (
                <LoadingSpinner />
              ) : reportData ? (
                <>
                  {/* Stats Summary Box at the top */}
                  <QuizStatsSummary reportData={reportData} />
                  
                  {/* Charts Grid - Both will have identical heights now */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <StatisticalOverviewChart reportData={reportData} />
                    <ScoreDistributionChart
                      data={scoreDistributionData}
                      totalAttempts={reportData.totalAttempts}
                    />
                  </div>
                </>
              ) : (
                <NoDataMessage message="No report data available for this quiz." />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherReports;