import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import InstructorManageUsers from "@/components/instructor-view/users";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService, fetchUsersListService } from "@/services";
import { AwardIcon, BarChart, Book, Component, LogOut, Users } from "lucide-react";
import { useContext, useEffect, useState } from "react";



function InstructorDashboardPage({instructor}) {

  const [activeTab, setActiveTab] = useState('');
  const {resetCredentials} = useContext(AuthContext)
  const {instructorCourseList, setInstructorCourseList} = useContext(InstructorContext);
  const [listOfUsers, setListOfUsers] = useState([]);

  async function fetchAllCourse() {
    const response = await fetchInstructorCourseListService()

    if(response.success) {
      setInstructorCourseList(response?.data)
    }    
  }

  async function fetchAllUser() {
    const response = await fetchUsersListService()
    
    if(response.success) {
      setListOfUsers(response?.data)
    }    
    
  }

  useEffect(()=> {
    fetchAllCourse();
    fetchAllUser();

    const tab = sessionStorage.getItem('activeTab') || 'dashboard'

    setActiveTab(tab)

    const interval = setInterval(() => {
      fetchAllCourse();
      fetchAllUser();
    }, 30000);
    
    return () => clearInterval(interval);
  },[])

  const menuItems = [
    {
      icon: BarChart,
      label: 'Dashboard',
      value: 'dashboard',
      component: <InstructorDashboard listOfCourses={instructorCourseList} onCourseChanged={fetchAllCourse}/>
    },
    {
      icon: Book,
      label: 'Courses',
      value: 'courses',
      component: <InstructorCourses listOfCourses={instructorCourseList} onCourseChanged={fetchAllCourse}/>
    },
    ...(instructor.role === 'admin'
      ? [{
          icon: Users,
          label: 'Users',
          value: 'users',
          component: <InstructorManageUsers listOfUsers={listOfUsers} />
        }]
      : []),
    {
      icon: LogOut,
      label: 'Logout',
      value: 'logout',
      component: null
    }
  ];

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Instructor {instructor.userName}</h2>
          <nav>
            {
              menuItems.map(menuItem=> <Button
                className = "w-full justify-start mb-2"
                key = {menuItem.value}
                variant = {activeTab === menuItem.value ? 'default' : 'ghost'}
                onClick = {menuItem.value === 'logout' ?
                  handleLogout : ()=> {
                    setActiveTab(menuItem.value)
                    sessionStorage.setItem('activeTab', menuItem.value)
                  }
                }
                >
                <menuItem.icon className="mr-2 h-4 w-4"/>
                {menuItem.label}
              </Button>)
            }
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7x1 mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            Dashboard
          </h1>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {
              menuItems.map(menuItem=> <TabsContent value={menuItem.value}>
                {
                  menuItem.component !== null ? menuItem.component : null
                }
              </TabsContent>)
            }
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export default InstructorDashboardPage;
