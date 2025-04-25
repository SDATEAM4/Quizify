import { TeacherNavbar } from "../components/teacherNavbar.jsx";
import { CourseCard } from "../components/courseCard.jsx";
import { Footer } from "../components/footer.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const TeacherHomePage = () => {
  // State variables
  const [user, setUser] = useState({});
  const [courses, setCourses] = useState([]);
  
  const setData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/Quizify/admin/user/1");
      console.log(response.data);
      
      if (response.status === 200) {
        // Set user and courses data from the response
        setUser(response.data.user);
        setCourses(response.data.enrolledSubjectsWithNames);
        
        toast.success("User data successfully fetched");
      } else {
        toast.error("Could not fetch user details");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching user data");
    }
  };
  
  useEffect(() => {
    console.log("test");
    setData();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TeacherNavbar />
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex-1">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Student Dashboard
        </h1>
        {/* Student Profile Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Student Profile
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">
                USERNAME
              </h3>
              <p className="text-gray-800">{user?.username || "N/A"}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">
                NAME
              </h3>
              <p className="text-gray-800">{`${user?.fname || ''} ${user?.lname || ''}`}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">
                EMAIL
              </h3>
              <p className="text-gray-800">{user?.email || "N/A"}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">
                ENROLLED SUBJECTS
              </h3>
              <p className="text-gray-800">{courses?.length || 0} subjects</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">
                BIO
              </h3>
              <p className="text-gray-800">
                {user?.bio || "No bio available"}
              </p>
            </div>
          </div>
        </section>
        {/* My Subjects Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            My Subjects
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {courses && courses.length > 0 ? (
              courses.map(course => (
                <CourseCard
                  key={course.id}
                  title={course.name}
                  description={course.description || "No description available"}
                  imageUrl={course.imageUrl || "/default-course-image.jpg"}
                  iconClass={course.iconClass || "fas fa-book"}
                  onClick={() => console.log(`${course.name} card clicked`)}
                />
              ))
            ) : (
              <p className="text-gray-500">No subjects enrolled yet.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};