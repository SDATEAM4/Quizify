import React from 'react';
import { FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';

export const UserRoleSelector = ({ selectedRole, setSelectedRole }) => {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 mb-3">User Role</label>
      <div className="flex space-x-4">
        <div 
          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
            selectedRole === 'teacher' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onClick={() => setSelectedRole('teacher')}
        >
          <input
            type="radio"
            id="role-teacher"
            name="userRole"
            checked={selectedRole === 'teacher'}
            onChange={() => setSelectedRole('teacher')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 sr-only"
          />
          <label 
            htmlFor="role-teacher" 
            className="flex items-center ml-2 cursor-pointer"
          >
            <FaChalkboardTeacher className="mr-2 text-blue-600" />
            <span>Teacher</span>
          </label>
        </div>

        <div 
          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
            selectedRole === 'student' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onClick={() => setSelectedRole('student')}
        >
          <input
            type="radio"
            id="role-student"
            name="userRole"
            checked={selectedRole === 'student'}
            onChange={() => setSelectedRole('student')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 sr-only"
          />
          <label 
            htmlFor="role-student" 
            className="flex items-center ml-2 cursor-pointer"
          >
            <FaUserGraduate className="mr-2 text-blue-600" />
            <span>Student</span>
          </label>
        </div>
      </div>
    </div>
  );
};