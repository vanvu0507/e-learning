import { useContext } from 'react'
import RouteGuard from './components/route-guard'
import AuthPage from './pages/auth'
import { Route, Routes } from 'react-router-dom'
import { AuthContext } from './context/auth-context'
import InstructorDashboardPage from './pages/instructor'
import StudentViewCommonLayout from './components/student-view/common-layout'
import StudentHomePage from './pages/student/home'
import NotFoundPage from './pages/not-found'
import AddNewCoursePage from './pages/instructor/add-new-course'
import StudentViewCoursesPage from './pages/student/courses'
import StudentViewCourseDetailsPage from './pages/student/course-details'
import PaypalPaymentReturnPage from './pages/student/payment-return'
import StudentCoursesPage from './pages/student/student-courses'
import StudentViewCourseProgressPage from './pages/student/course-progress'
import AddNewInstructorPage from './pages/instructor/add-new-instructor'

function App() {

  const {auth} = useContext(AuthContext);
  return (
    <Routes>
      <Route
      path='/auth'
      element={
        <RouteGuard 
        element={<AuthPage/>}
        authenticated={auth?.authenticate}
        user={auth?.user}
        />
      }
      />

      <Route
      path='/instructor'
      element={
        <RouteGuard
        element={
          <InstructorDashboardPage instructor={auth?.user}/>
        }
        authenticated={auth?.authenticate}
        user={auth?.user}
        />
      }
      />
      <Route
      path='/instructor/create-new-course'
      element={
        <RouteGuard
        element={
          <AddNewCoursePage/>
        }
        authenticated={auth?.authenticate}
        user={auth?.user}
        />
      }
      />
      <Route
      path='/instructor/edit-course/:courseId'
      element={
        <RouteGuard
        element={
          <AddNewCoursePage/>
        }
        authenticated={auth?.authenticate}
        user={auth?.user}
        />
      }
      />
      <Route
      path='/instructor/create-new-instructor'
      element={
        <RouteGuard
        element={
          <AddNewInstructorPage/>
        }
        authenticated={auth?.authenticate}
        user={auth?.user}
        requiredRole="admin"
        />
      }
      />

      <Route
      path='/'
      element={
        <RouteGuard
        element={
          <StudentViewCommonLayout/>
        }
        authenticated={auth?.authenticate}
        user={auth?.user}
        />
      }
      >
        <Route path='' element={<StudentHomePage />} />
        <Route path='home' element={<StudentHomePage />} />
        <Route path='courses' element={<StudentViewCoursesPage />} />
        <Route path='course/details/:id' element={<StudentViewCourseDetailsPage />} />
        <Route path='payment-return' element={<PaypalPaymentReturnPage />} />
        <Route path='student-courses' element={<StudentCoursesPage />}/>
        <Route path='course-progress/:id' element={<StudentViewCourseProgressPage />}/>
      </Route>
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
