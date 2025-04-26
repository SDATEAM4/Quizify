import { NavBar } from '../components/navbar.jsx';
import { CourseCard } from '../components/courseCard.jsx';
import { Footer } from '../components/footer.jsx';
import { useAuth } from '../context/authContext.jsx';
import { useMemo } from 'react';

export const StudentHomePage = () => {
  const { user, enrolledSubjects } = useAuth();
  
  // Array of dummy course images
  const courseImages = useMemo(() => [
    'https://readdy.ai/api/search-image?query=abstract%20physics%20concept%20visualization%20with%20particles%2C%20waves%2C%20and%20light%20effects%2C%20elegant%20and%20minimalist%20design%2C%20soft%20warm%20colors%2C%20perfect%20for%20educational%20platform%2C%20clean%20background%2C%20high%20quality%20render&width=600&height=300&seq=2&orientation=landscape',
    'https://readdy.ai/api/search-image?query=abstract%20mathematics%20concept%20with%20geometric%20shapes%2C%20equations%2C%20and%20mathematical%20symbols%20floating%20in%20space%2C%20clean%20minimalist%20design%2C%20soft%20colors%2C%20perfect%20for%20educational%20platform%2C%20clean%20background%2C%20high%20quality%20render&width=600&height=300&seq=3&orientation=landscape',
    'https://readdy.ai/api/search-image?query=abstract%20history%20concept%20with%20ancient%20architecture%20silhouettes%2C%20scrolls%2C%20and%20timeline%20elements%2C%20elegant%20minimalist%20design%2C%20muted%20colors%2C%20perfect%20for%20educational%20platform%2C%20clean%20background%2C%20high%20quality%20render&width=600&height=300&seq=4&orientation=landscape',
    'https://readdy.ai/api/search-image?query=abstract%20science%20concept%20with%20molecular%20structures%2C%20DNA%20helix%2C%20and%20chemical%20elements%2C%20modern%20minimalist%20design%2C%20cool%20colors%2C%20perfect%20for%20educational%20platform%2C%20clean%20background%2C%20high%20quality%20render&width=600&height=300&seq=5&orientation=landscape'
  ], []);
  
  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * courseImages.length);
    return courseImages[randomIndex];
  };
  
  // Assign random images to courses
  const coursesWithImages = useMemo(() => {
    return enrolledSubjects.map(course => ({
      ...course,
      imageUrl: getRandomImage()
    }));
  }, [enrolledSubjects]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
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
              <p className="text-gray-800">{user.username}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">
                NAME
              </h3>
              <p className="text-gray-800">{user.fname}{' '}{user.lname}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">
                BIO
              </h3>
              <p className="text-gray-800">
              {user.bio ? user.bio : "Bio not Set"}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">
                ENROLLED SUBJECTS
              </h3>
              <p className="text-gray-800">{enrolledSubjects.length} subjects</p>
            </div>
          </div>
        </section>
        {/* My Subjects Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            My Subjects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesWithImages.map(course => (
              <CourseCard
                key={course.id}
                title={course.name}
                imageUrl={course.imageUrl}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};