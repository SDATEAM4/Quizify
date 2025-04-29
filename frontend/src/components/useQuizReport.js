import { useState, useEffect } from "react";
import axios from "axios";
import { generateScoreDistribution, generatePassFailData, generateTimeSpentData } from "./reportDataUtil";

export const useQuizReports = (teacherId) => {
  const [quizzes, setQuizzes] = useState([]);
  const [allReportsData, setAllReportsData] = useState({});
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);
  const [scoreDistributionData, setScoreDistributionData] = useState([]);
  const [passFailData, setPassFailData] = useState([]);
  const [timeSpentData, setTimeSpentData] = useState([]);

  // Fetch all quizzes for the logged-in teacher
  useEffect(() => {
    const fetchTeacherQuizzes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/Quizify/quizzes/teacher/${teacherId}`
        );

        if (response.data && response.data.length > 0) {
          setQuizzes(response.data);
          await fetchAllQuizReports(response.data);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching teacher quizzes:", error);
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchTeacherQuizzes();
    }
  }, [teacherId]);

  // Fetch all quiz reports at once
  const fetchAllQuizReports = async (quizzesData) => {
    try {
      setLoadingReports(true);

      // Create an object to store all reports
      const reportsObject = {};

      // Create an array of promises for fetching all reports
      const reportPromises = quizzesData.map((quiz) =>
        axios
          .get(
            `http://localhost:8080/Quizify/reports/teacher/quiz/${quiz.quiz_id}`
          )
          .then((response) => {
            if (response.data) {
              reportsObject[quiz.quiz_id] = response.data;
            }
            return response;
          })
          .catch((error) => {
            console.error(
              `Error fetching report for quiz ${quiz.quiz_id}:`,
              error
            );
            return null;
          })
      );

      // Wait for all promises to resolve
      await Promise.all(reportPromises);

      // Set all reports data
      setAllReportsData(reportsObject);

      // Set the current report data (first quiz)
      if (quizzesData.length > 0) {
        const firstQuizId = quizzesData[0].quiz_id;
        const firstQuizReport = reportsObject[firstQuizId];

        if (firstQuizReport) {
          updateCurrentReport(firstQuizReport);
        }
      }

      setLoadingReports(false);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching all quiz reports:", error);
      setLoadingReports(false);
      setLoading(false);
    }
  };

  // Update the current report data and generate chart data
  const updateCurrentReport = (report) => {
    setReportData(report);
    
    const scoreData = generateScoreDistribution(report);
    setScoreDistributionData(scoreData);
    
    const passFailData = generatePassFailData(report);
    setPassFailData(passFailData);
    
    const timeData = generateTimeSpentData(report);
    setTimeSpentData(timeData);
  };

  return {
    quizzes,
    reportData,
    allReportsData,
    loading,
    loadingReports,
    scoreDistributionData,
    passFailData,
    timeSpentData,
    fetchAllQuizReports: {
      execute: fetchAllQuizReports,
      updateCurrentReport
    }
  };
};