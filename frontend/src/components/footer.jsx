import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

export const Footer = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate('/');
  };

  return (
    <footer className="bg-black text-white py-4 mt-auto">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-center sm:text-left">&copy; 2025 Quizify. All rights reserved.</p>
        </div>
        <div className="flex items-center justify-center sm:justify-end">
          <button
            className="text-white flex items-center cursor-pointer whitespace-nowrap"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-2" />
            Log Out
          </button>
        </div>
      </div>
    </footer>
  );
};
