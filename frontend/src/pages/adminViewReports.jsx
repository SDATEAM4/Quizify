import { useState } from 'react';
import { Search } from 'lucide-react';

export default function ViewReports() {
  // Using the data format provided
  const subjectsData = [
    {
      "studentCount": 4,
      "teachers": [
        {
          "teacherId": 3,
          "name": "Ali Afzal"
        },
        {
          "teacherId": 2,
          "name": "Tahir Ijaz"
        },
        {
          "teacherId": 2,
          "name": "Tahir Ijaz"
        },
        {
          "teacherId": 2,
          "name": "Tahir Ijaz"
        }
      ],
      "teacherCount": 2,
      "subjectId": 1,
      "subjectName": "Math"
    },
    {
      "studentCount": 4,
      "teachers": [
        {
          "teacherId": 3,
          "name": "Ali Afzal"
        },
        {
          "teacherId": 2,
          "name": "Tahir Ijaz"
        }
      ],
      "teacherCount": 2,
      "subjectId": 2,
      "subjectName": "Science"
    },
    {
      "studentCount": 6,
      "teachers": [
        {
          "teacherId": 1,
          "name": "Sarah Johnson"
        }
      ],
      "teacherCount": 1,
      "subjectId": 3,
      "subjectName": "English Literature"
    },
    {
      "studentCount": 8,
      "teachers": [
        {
          "teacherId": 4,
          "name": "Robert Williams"
        },
        {
          "teacherId": 5,
          "name": "Emily Parker"
        }
      ],
      "teacherCount": 2,
      "subjectId": 4,
      "subjectName": "Computer Science"
    },
    {
      "studentCount": 5,
      "teachers": [
        {
          "teacherId": 6,
          "name": "James Wilson"
        }
      ],
      "teacherCount": 1,
      "subjectId": 5,
      "subjectName": "History"
    },
    {
      "studentCount": 7,
      "teachers": [
        {
          "teacherId": 7,
          "name": "Lisa Thompson"
        },
        {
          "teacherId": 8,
          "name": "David Miller"
        }
      ],
      "teacherCount": 2,
      "subjectId": 6,
      "subjectName": "Physics"
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSubject, setExpandedSubject] = useState(null);

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">View Reports</h1>
        <p className="text-gray-600 mt-1">Manage and analyze subject performance data</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Subject Reports</h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search subjects..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map(subject => (
          <div key={subject.subjectId} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
    </div>
  );
}