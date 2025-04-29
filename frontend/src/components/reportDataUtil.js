// Helper function to map level numbers to verbal descriptions
export const getLevelDescription = (level) => {
  if (!level) return "N/A";

  switch (level.toString()) {
    case "1":
      return "Beginner";
    case "2":
      return "Intermediate";
    case "3":
      return "Advanced";
    default:
      return level; // Return original value if not 1, 2, or 3
  }
};

// Generate score distribution data based on the report data
export const generateScoreDistribution = (data) => {
  if (!data || !data.totalAttempts || data.totalAttempts <= 0) {
    return [
      { range: "0-20", students: 0 },
      { range: "21-40", students: 0 },
      { range: "41-60", students: 0 },
      { range: "61-80", students: 0 },
      { range: "81-100", students: 0 },
    ];
  }

  // Create a realistic distribution based on the report data
  const total = data.totalAttempts;
  const min = data.minimumMarks;
  const max = data.maximumMarks;
  const avg = data.averageMarks;

  // Initialize all buckets with zero
  const distribution = [
    { range: "0-20", students: 0 },
    { range: "21-40", students: 0 },
    { range: "41-60", students: 0 },
    { range: "61-80", students: 0 },
    { range: "81-100", students: 0 },
  ];

  // Determine which bucket the marks fall into
  if (min >= 0 && min <= 20) distribution[0].students += 1;
  else if (min > 20 && min <= 40) distribution[1].students += 1;
  else if (min > 40 && min <= 60) distribution[2].students += 1;
  else if (min > 60 && min <= 80) distribution[3].students += 1;
  else if (min > 80 && min <= 100) distribution[4].students += 1;

  // If we have more than one student, distribute the rest based on the average and max
  if (total > 1) {
    // Determine remaining students to distribute
    const remainingStudents = total - 1;

    // Calculate which buckets should get the remaining students
    if (avg <= 20) {
      distribution[0].students += remainingStudents;
    } else if (avg <= 40) {
      distribution[1].students += Math.ceil(remainingStudents * 0.7);
      distribution[0].students += Math.floor(remainingStudents * 0.3);
    } else if (avg <= 60) {
      distribution[2].students += Math.ceil(remainingStudents * 0.6);
      distribution[1].students += Math.floor(remainingStudents * 0.3);
      distribution[3].students += Math.floor(remainingStudents * 0.1);
    } else if (avg <= 80) {
      distribution[3].students += Math.ceil(remainingStudents * 0.6);
      distribution[2].students += Math.floor(remainingStudents * 0.3);
      distribution[4].students += Math.floor(remainingStudents * 0.1);
    } else {
      distribution[4].students += Math.ceil(remainingStudents * 0.7);
      distribution[3].students += Math.floor(remainingStudents * 0.3);
    }
  }

  // Ensure total matches by adjusting if necessary
  let currentTotal = distribution.reduce(
    (sum, item) => sum + item.students,
    0
  );

  if (currentTotal !== total) {
    // Find non-zero bucket with smallest value to adjust
    const bucketsWithStudents = distribution
      .map((item, index) => ({ students: item.students, index }))
      .filter((item) => item.students > 0)
      .sort((a, b) => a.students - b.students);

    if (bucketsWithStudents.length > 0) {
      const adjustIndex = bucketsWithStudents[0].index;
      distribution[adjustIndex].students += total - currentTotal;
    } else {
      // If all buckets are zero (shouldn't happen if total > 0)
      distribution[2].students += total - currentTotal;
    }
  }

  return distribution;
};

// Generate pass/fail data based on the report data
export const generatePassFailData = (data) => {
  if (!data || !data.totalAttempts || data.totalAttempts <= 0) {
    return [
      { name: "Pass", value: 0 },
      { name: "Fail", value: 0 },
    ];
  }

  // Assume pass mark is 40% (can be adjusted based on actual requirements)
  const passThreshold = 40;
  const total = data.totalAttempts;
  const avg = data.averageMarks;

  // Calculate pass/fail numbers based on the average and total attempts
  let passCount = 0;
  let failCount = 0;

  if (avg >= passThreshold) {
    // If average is above pass threshold, more students pass than fail
    passCount = Math.ceil(total * 0.7);
    failCount = total - passCount;
  } else {
    // If average is below pass threshold, more students fail than pass
    failCount = Math.ceil(total * 0.7);
    passCount = total - failCount;
  }

  // Ensure no negative counts
  passCount = Math.max(0, passCount);
  failCount = Math.max(0, failCount);

  return [
    { name: "Pass", value: passCount },
    { name: "Fail", value: failCount },
  ];
};

// Generate time spent data based on the report data
export const generateTimeSpentData = (data) => {
  if (!data || !data.totalAttempts || data.totalAttempts <= 0) {
    return [];
  }

  // Create simulated time data points based on the quiz difficulty level
  const level = data.level || 2; // Default to intermediate if not specified
  const baseTime = level * 5; // Base time in minutes based on level
  const totalStudents = data.totalAttempts;

  // Create time distribution data
  const timeData = [];

  // Create 5 data points for time spent by students
  for (let i = 0; i < 5; i++) {
    // Calculate a representative time for each segment
    const timeVariation = Math.random() * 0.5 + 0.75; // Random between 0.75 and 1.25
    const timeValue = Math.round(baseTime * timeVariation);

    // Calculate how many students for this time segment
    const studentCount =
      Math.floor(totalStudents / 5) + (i === 0 ? totalStudents % 5 : 0);

    timeData.push({
      group: `Group ${i + 1}`,
      time: timeValue,
      students: studentCount,
    });
  }

  return timeData;
};

// Constants for colors
export const scoreRangeColors = [
  "#F59E0B", // 0-20 (Red)
  "#10B981", // 21-40 (Orange)
  "#FFC107", // 41-60 (Yellow/Amber)
  "#6366F1", // 61-80 (Green)
  "#3B82F6", // 81-100 (Blue)
];

export const passFailColors = ["#EF4444", "#10B981"]; // Red, Green