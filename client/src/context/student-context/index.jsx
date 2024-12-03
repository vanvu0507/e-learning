import { createContext, useState } from "react";


export const StudentContext = createContext(null)

export default function StudentProvider({children}) {
    const [studentViewCoursesList, setStudentViewCoursesList] = useState([])
    const [loadingState, setLoadingState] = useState(true);
    const [studentViewCourseDetails, setStudentViewCourseDetails] = useState(null);
    const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);
    const [studentBoughtCoursesList, setStudentBoughtCoursesList] = useState([]);
    const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    return (
    <StudentContext.Provider
    value={{ studentViewCoursesList, 
        setStudentViewCoursesList, 
        loadingState, 
        setLoadingState,
        searchQuery, setSearchQuery,
        studentViewCourseDetails, 
        setStudentViewCourseDetails, 
        currentCourseDetailsId, 
        setCurrentCourseDetailsId,
        studentBoughtCoursesList, 
        setStudentBoughtCoursesList,
        studentCurrentCourseProgress, setStudentCurrentCourseProgress,
    }}
    >
        {children}
    </StudentContext.Provider>
    )
}