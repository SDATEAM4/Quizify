import { FaUser, FaUserCircle, FaLock, FaEyeSlash, FaEye } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { useState } from 'react';
import { UserRoleSelector } from './userRoleSelector';
export const AddUserForm = ({firstname,setfirstname,lastname,setlastname,email,setemail,username,setUsername,password,passwordStrength,handlePasswordChange}) =>{
  // User role state
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [selectedRole, setSelectedRole] = useState('teacher');
  return (
    <>
    <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="firstname">First Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              id="firstname"
              type="text"
              className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter first name"
              value={firstname}
              onChange={(e) => setfirstname(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="lastname">Last Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              id="lastname"
              type="text"
              className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter last name"
              value={lastname}
              onChange={(e) => setlastname(e.target.value)}
            />
          </div>
        </div>        

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineMail className="text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter first name"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
          </div>
        </div>

        {/* Username Field */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUserCircle className="text-gray-400" />
            </div>
            <input
              id="username"
              type="text"
              className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        
        {/* Password Field */}
        <div className="mb-6">
      <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaLock size={18} className="text-gray-400" />
        </div>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          className="pl-10 pr-12 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      </div>
      
      {/* Password Strength Indicator */}
      {passwordStrength && (
        <div className="mt-2">
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                passwordStrength === 'weak' ? 'w-1/3 bg-red-500' : 
                passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' : 
                'w-full bg-green-500'
              }`} 
            />
          </div>
          <p className={`text-xs mt-1 ${
            passwordStrength === 'weak' ? 'text-red-500' : 
            passwordStrength === 'medium' ? 'text-yellow-500' : 
            'text-green-500'
          }`}>
            {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)} password
          </p>
        </div>
      )}

          {/* Role Selection  */}
          <div className='mt-2'>

          <UserRoleSelector selectedRole={selectedRole} setSelectedRole={setSelectedRole}/>
          </div>
        </div>
    </>
  )
}