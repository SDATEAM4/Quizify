import { useState, useEffect } from "react";
import toast from 'react-hot-toast'
import { TeacherNavbar } from "../components/teacherNavbar";
import axios from "axios";
import { useAuth } from "../context/authContext";
export default function AddNewQuestion() {
  const {taughtSubjects} = useAuth();
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState({
    A: "",
    B: "",
    C: "",
    D: ""
  });
  const [correctAnswer, setCorrectAnswer] = useState("A");
  const [difficulty, setDifficulty] = useState("Easy");
  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState(5); // Default marks value
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch taughtSubjects for dropdown
  useEffect(() => {
    const fetchtaughtSubjects = async () => {
      document.title = 'Quizify - Teacher Add Question'
    };

    fetchtaughtSubjects();
  }, []);

  const handleOptionChange = (option, value) => {
    setOptions({ ...options, [option]: value });
  };

  const handleClear = () => {
    // Reset all form fields
    setQuestionText("");
    setOptions({
      A: "",
      B: "",
      C: "",
      D: ""
    });
    setCorrectAnswer("A");
    setDifficulty("Easy");
    setSubject("");
    setMarks(5); // Reset marks to default
    setSuccess(false);
    setError(null);
  };

  // Map difficulty string to numerical value
  const mapDifficultyToLevel = (difficultyString) => {
    const difficultyMap = {
      "Easy": 1,
      "Medium": 2,
      "Hard": 3
    };
    return difficultyMap[difficultyString] || 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Check for duplicate options
      const values = Object.values(options);
      const uniqueValues = new Set(values.map(opt => opt.trim().toLowerCase())); // Case-insensitive check

      if (uniqueValues.size < values.length) {
        toast.error("Answer options must be unique!");
        return;
      }

      // Convert options object to array format required by API
      const optionsArray = [options.A, options.B, options.C, options.D];
      
      // Get the correct option value based on selected letter
      const correctOptionValue = options[correctAnswer];
      
      const questionData = {
        statement: questionText,
        marks: parseInt(marks, 10),
        level: mapDifficultyToLevel(difficulty),
        subjectId: parseInt(subject, 10), // Convert string to integer
        correctOption: correctOptionValue,
        options: optionsArray
      };

      console.log("Sending question data:", questionData);
      
      const response = await axios.post('http://localhost:8080/Quizify/questions', questionData);
      toast.success("Question added succesfully")
      console.log("Response:", response.data);
      setSuccess(true);
      
      // Optionally clear form after successful submission
      handleClear();
      
    } catch (err) {
      toast.success("Could not add question")
      console.error("Error adding question:", err);
      setError(err.response?.data?.message || "Failed to add question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-screen max-h-screen">
      <TeacherNavbar/>    

      <div className="min-w-screen flex flex-col items-center justify-centre pt-10">
      <div className="p-6 bg-white shadow-lg rounded-lg min-w-1/3">
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded">
            Question added successfully!
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">
            {error}
          </div>
        )}
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Add New Question</h1>
          <p className="text-gray-600">Create a new question for your quiz</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Subject <span className="text-red-500">*</span>
              </label>
              <div className="relative">
              <select 
  className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white pr-10"
  required
  value={subject}
  onChange={(e) => setSubject(e.target.value)}
>
  <option value="">Select a subject</option>
  {taughtSubjects.map(subj => (
    <option key={subj.subject_id} value={subj.subject_id}>
      {subj.name}
    </option>
  ))}
</select>

                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Difficulty Level <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col gap-1">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="difficulty"
                      value="Easy"
                      checked={difficulty === "Easy"}
                      onChange={() => setDifficulty("Easy")}
                      className="mr-2"
                    />
                    <span>Easy</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="difficulty"
                      value="Medium"
                      checked={difficulty === "Medium"}
                      onChange={() => setDifficulty("Medium")}
                      className="mr-2"
                    />
                    <span>Medium</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="difficulty"
                      value="Hard"
                      checked={difficulty === "Hard"}
                      onChange={() => setDifficulty("Hard")}
                      className="mr-2"
                    />
                    <span>Hard</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Marks <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                <span className="text-xs text-gray-500 mt-1 block">
                  Points awarded for correct answer
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">
              Question Statement <span className="text-red-500">*</span>
            </label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter your question here"
              className="w-full p-3 border border-gray-300 rounded-md min-h-32"
              maxLength={500}
              required
            ></textarea>
            <div className="flex justify-between mt-1">
              <span className="text-sm text-gray-500">Be clear and concise</span>
              <span className="text-sm text-gray-500">{questionText.length}/500</span>
            </div>
          </div>

          <div className="mb-8">
            <label className="flex items-center mb-4 text-sm font-medium">
              Answer Options <span className="text-red-500">*</span>
              <span className="text-gray-500 ml-2">(Select one correct answer)</span>
            </label>

            <div className="space-y-4">
              {["A", "B", "C", "D"].map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={correctAnswer === option}
                    onChange={() => setCorrectAnswer(option)}
                    className="mr-3"
                  />
                  <span className="w-8">{option}</span>
                  <input
                    type="text"
                    value={options[option]}
                    onChange={(e) => handleOptionChange(option, e.target.value)}
                    placeholder={`Enter option ${option}`}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button 
              type="button" 
              className="px-6 py-2 border border-gray-300 rounded-md"
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </button>
            <button 
              type="submit" 
              className={`px-6 py-2 ${loading ? 'bg-gray-500' : 'bg-black'} text-white rounded-md flex items-center`}
              disabled={loading}
            >
              {loading ? (
                <span>Adding...</span>
              ) : (
                <span>Add Question</span>
              )}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}