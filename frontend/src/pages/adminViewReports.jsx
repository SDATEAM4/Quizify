import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { AdminNavBar } from '../components/adminNavbar';
import axios from 'axios';
import BackgroundTypography from '../components/backgroundTypography';
export default function ViewReports() {
  const [subjectsData, setSubjectsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSubject, setExpandedSubject] = useState(null);

  useEffect(() => {
    document.title = 'Quizify - Admin Reports'
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/Quizify/reports/admin/subject-teacher-student');
        
        // With axios, the data is already parsed from JSON
        setSubjectsData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredSubjects = subjectsData.filter(subject =>
    subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSubjectDetails = (subjectId) => {
    if (expandedSubject === subjectId) {
      setExpandedSubject(null);
    } else {
      setExpandedSubject(subjectId);
    }
  };

  return (
    <div>
      <AdminNavBar />
      <BackgroundTypography/>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">View Reports</h1>
          <p className="text-gray-600 mt-1">Manage and analyze subject performance data</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
  <h2 className="text-lg sm:text-xl font-semibold text-gray-700 text-center sm:text-left">
    Subject Reports
  </h2>

  <div className="relative w-full sm:w-auto z-20 bg-white">
    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
    <input
      type="text"
      placeholder="Search subjects..."
      className="w-full sm:w-[250px] pl-10 pr-4 py-2 border border-black rounded-lg focus:outline-none text-black focus:ring-2 focus:ring-blue-500"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
</div>


        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">Loading reports data...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
            {error}
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-yellow-700">
            No subjects found matching your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map(subject => (
              <div key={subject.subjectId} className="bg-white p-6 z-20 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{subject.subjectName}</h3>
                </div>

                <div className="flex items-center mb-4">
                  <div className="bg-gray-100 rounded-full p-2 mr-3">
                    <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Students Enrolled</p>
                    <p className="font-semibold text-gray-800">{subject.studentCount}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">{subject.teacherCount > 1 ? 'Teachers:' : 'Teacher:'}</p>
                  
                  {/* Display only first 3 teachers or all if expanded */}
                  {(expandedSubject === subject.subjectId ? subject.teachers : subject.teachers.slice(0, 3)).map((teacher) => (
                    <div key={teacher.teacherId} className="flex items-center mt-1">
                      <div className="h-6 w-6 bg-gray-200 rounded-full mr-2 flex items-center justify-center text-xs text-gray-600">
                        {teacher.name.charAt(0)}
                      </div>
                      <p className="text-sm text-gray-700">{teacher.name}</p>
                    </div>
                  ))}
                  
                  {/* Show "more teachers" indicator if needed */}
                  {subject.teachers.length > 3 && expandedSubject !== subject.subjectId && (
                    <div className="text-sm text-gray-500 mt-1 pl-8">
                      +{subject.teachers.length - 3} more teacher{subject.teachers.length - 3 > 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                <button 
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  onClick={() => toggleSubjectDetails(subject.subjectId)}
                >
                  {expandedSubject === subject.subjectId ? (
                    <>Hide Details</>
                  ) : (
                    <>View Details</>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}