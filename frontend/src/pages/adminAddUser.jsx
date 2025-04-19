import { AdminNavBar } from "../components/adminNavbar"
import AddUserComponent from "../components/addUserModal"

export const AdminAddUserPage = () => {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      {/* Navbar section - fixed height */}
      <div className="w-full">
        <AdminNavBar/>
      </div>
      
      {/* Content section - scrollable */}
      <div className="flex-1 w-full overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <AddUserComponent/>
        </div>
      </div>
    </div>
  )
}