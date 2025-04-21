import React, { useState, useEffect } from "react";
import { TeacherNavbar } from "../components/teacherNavbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TeacherReports = () => {
  // Sample data based on your API response
  const [quizData, setQuizData] = useState({
    timeLimit: 1800,
    quizId: 4,
    level: "2",
    quizName: "Automatic",
    totalAttempts: 2,
    maximumMarks: 50,
    totalMarks: 100,
    averageMarks: 45,
    minimumMarks: 40,
    subjectId: 1,
  });

  const [subjects, setSubjects] = useState([
    { id: 1, name: "English" },
    { id: 2, name: "Mathematics" },
    { id: 3, name: "Science" },
  ]);

  const [quizzes, setQuizzes] = useState([
    { id: 1, name: "Quiz 1" },
    { id: 2, name: "Quiz 2" },
    { id: 3, name: "Quiz 3" },
    { id: 4, name: "Automatic" },
  ]);

  const [selectedSubject, setSelectedSubject] = useState(1);
  const [selectedQuiz, setSelectedQuiz] = useState(4);

  // Generate score distribution data based on quiz data
  // This would normally come from an API with actual student performance data
  const generateScoreDistributionData = () => {
    // For demonstration, we'll create a distribution that makes sense with the provided data
    // In a real scenario, this would be actual student score distribution data
    return [
      { range: "0-20", students: 0 },
      { range: "21-40", students: quizData.minimumMarks <= 40 ? 1 : 0 },
      {
        range: "41-60",
        students:
          quizData.averageMarks >= 41 && quizData.averageMarks <= 60 ? 1 : 0,
      },
      { range: "61-80", students: 0 },
      { range: "81-100", students: 0 },
    ];
  };

  const [scoreDistributionData, setScoreDistributionData] = useState(
    generateScoreDistributionData()
  );

  // Update score distribution when quiz data changes
  useEffect(() => {
    setScoreDistributionData(generateScoreDistributionData());
  }, [quizData]);

  const handleGenerateReport = () => {
    // This would fetch new data based on selections
    console.log(
      "Generating report for subject:",
      selectedSubject,
      "and quiz:",
      selectedQuiz
    );

    // Simulate fetching new data
    // In a real application, this would be an API call
    const newData = {
      ...quizData,
      totalAttempts: Math.floor(Math.random() * 10) + 2, // Random number between 2-12
      averageMarks: Math.floor(Math.random() * 30) + 40, // Random number between 40-70
      minimumMarks: Math.floor(Math.random() * 20) + 30, // Random number between 30-50
      maximumMarks: Math.floor(Math.random() * 20) + 80, // Random number between 80-100
    };

    setQuizData(newData);

    // Generate more realistic distribution data based on the new quiz data
    const total = newData.totalAttempts;
    const min = newData.minimumMarks;
    const max = newData.maximumMarks;
    const avg = newData.averageMarks;

    // Create a more realistic distribution based on the min, max, and average
    const newDistribution = [
      { range: "0-20", students: min < 20 ? Math.ceil(total * 0.1) : 0 },
      {
        range: "21-40",
        students:
          (min <= 40 && min >= 21) || (avg <= 40 && avg >= 21)
            ? Math.ceil(total * 0.2)
            : 0,
      },
      {
        range: "41-60",
        students:
          (min <= 60 && min >= 41) ||
          (avg <= 60 && avg >= 41) ||
          (max <= 60 && max >= 41)
            ? Math.ceil(total * 0.4)
            : Math.ceil(total * 0.2),
      },
      {
        range: "61-80",
        students:
          (avg <= 80 && avg >= 61) || (max <= 80 && max >= 61)
            ? Math.ceil(total * 0.3)
            : Math.ceil(total * 0.1),
      },
      { range: "81-100", students: max > 80 ? Math.ceil(total * 0.2) : 0 },
    ];

    // Adjust to ensure the total adds up correctly
    let currentTotal = newDistribution.reduce(
      (sum, item) => sum + item.students,
      0
    );

    if (currentTotal !== total) {
      // Adjust the largest bracket to make the total correct
      const largestIndex = newDistribution
        .map((item, index) => ({ students: item.students, index }))
        .sort((a, b) => b.students - a.students)[0].index;

      newDistribution[largestIndex].students += total - currentTotal;
    }

    setScoreDistributionData(newDistribution);
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <div className="w-full">
        <TeacherNavbar />
      </div>
      <div className="bg-gray-100 p-6 ">
        <div className="max-w-6xl mx-auto">
          {/* Report Generation Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Report Generation
            </h2>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Subject
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(Number(e.target.value))}
                >
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Quiz Number
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedQuiz}
                  onChange={(e) => setSelectedQuiz(Number(e.target.value))}
                >
                  {quizzes.map((quiz) => (
                    <option key={quiz.id} value={quiz.id}>
                      {quiz.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
                onClick={handleGenerateReport}
              >
                Generate Report
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Statistical Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Statistical Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Minimum Score</p>
                  <p className="text-2xl font-bold">{quizData.minimumMarks}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Maximum Score</p>
                  <p className="text-2xl font-bold">{quizData.maximumMarks}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Average Score</p>
                  <p className="text-2xl font-bold">{quizData.averageMarks}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Total Participants</p>
                  <p className="text-2xl font-bold">{quizData.totalAttempts}</p>
                </div>
              </div>
            </div>

            {/* Visual Analytics with Recharts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Visual Analytics
              </h2>

              <div className="mt-4">
                <h3 className="text-lg font-medium text-center mb-4">
                  Score Distribution
                </h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={scoreDistributionData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 60, // space for Y-axis label
                        bottom: 40, // space for X-axis label and legend
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis
                        dataKey="range"
                        label={{
                          value: "Marks",
                          position: "insideBottom",
                          dy: 40,
                          dx:-30,
                          style: { fontSize: 14 },
                        }}
                      />

                      <YAxis
                        label={{
                          value: "Students",
                          angle: -90,
                          position: "outsideLeft",
                          dx: -25,
                          style: { fontSize: 14 },
                        }}
                      />

                      <Tooltip />

                      <Legend verticalAlign="bottom" height={36} />

                      <Bar dataKey="students"fill="#2c3e50" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherReports;
