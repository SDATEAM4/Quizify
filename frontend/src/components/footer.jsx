import { FaSignOutAlt } from 'react-icons/fa';
export const Footer = () =>{
  return (
    <footer className="bg-black text-white py-4 mt-auto">
    <div className="container mx-auto px-4 flex justify-between items-center">
      <div>
        <p className="text-sm">&copy; 2025 Quizify. All rights reserved.</p>
      </div>
      <div>
        <button className="text-white flex items-center cursor-pointer whitespace-nowrap">
        <FaSignOutAlt className="mr-2" />
          Log Out
        </button>
      </div>
    </div>
  </footer>
  )
}