import { AdminNavBar } from "../components/adminNavbar"
import AddUserComponent from "../components/addUserModal"
import BackgroundTypography from '../components/backgroundTypography'
import { useEffect } from "react"
export const AdminAddUserPage = () => {
  
  useEffect(()=>{
    document.title = 'Quizify - Admin Add User'
  })
  return (
    <div className="min-h-screen w-full bg-white flex flex-col -z-0">
      {/* Navbar section - fixed height */}
      <div className="w-full">
        <AdminNavBar/>
      </div>
      
      {/* Content section - scrollable */}
      <div className="flex-1 w-full overflow-y-auto mt-[100px] p-6 z-10">
        <div className="max-w-4xl mx-auto">
          <AddUserComponent/>
        </div>
      </div>
      <BackgroundTypography/>
    </div>
  )
}