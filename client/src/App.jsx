import { useContext } from 'react'
import RouteGuard from './components/route-guard'
import AuthPage from './pages/auth'
import { Route, Routes } from 'react-router-dom'
import { AuthContext } from './context/auth-context'
import InstructorDashboardPage from './pages/instructor'
import StudentViewCommonLayout from './components/student-view/common-layout'
import StudentHomePage from './pages/student/home'
import NotFoundPage from './pages/not-found'

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
          <InstructorDashboardPage/>
        }
        authenticated={auth?.authenticate}
        user={auth?.user}
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
      </Route>
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
