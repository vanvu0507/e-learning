import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { addNewCourseService, fetchInstructorCourseDetailsService, fetchInstructorCourseListService, updateCourseByIdService } from "@/services";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AddNewCoursePage() {

    const {courseLandingFormData, setCourseLandingFormData, courseCurriculumFormData, setCourseCurriculumFormData, currentEditedCourseId, setCurrentEditedCourseId, instructorCourseList, setInstructorCourseList} = useContext(InstructorContext);

    const [isPublished, setIsPublished] = useState(true);

    const {auth} = useContext(AuthContext)
    const navigate = useNavigate()
    const params = useParams()

    async function fetchAllCourse() {
        const response = await fetchInstructorCourseListService()
    
        if(response.success) {
          setInstructorCourseList(response?.data)
        }    
        
    }

    function handleIsPublishedChange(value) {
        setIsPublished(value);
    }

    function isEmpty(value) {
        if(Array.isArray(value)) {
            return value.length === 0;
        }

        return value === "" || value === null || value === undefined
    }

    function validateFormData() {
        for(const key in courseLandingFormData) {
            if(isEmpty(courseLandingFormData[key])) {
                return false;
            }
        }

        let hasFreePreview = false;

        for(const item of courseCurriculumFormData) {
            if(isEmpty(item.title) || isEmpty(item.videoUrl) || isEmpty(item.public_id)) {
                return false
            }

            if(item.freePreview) {
                hasFreePreview = true; //found at least one free preview
            }
        }

        return hasFreePreview;
    }

    async function handleCreateCourse() {
        let students = [];
        if(currentEditedCourseId) {
            fetchAllCourse();            
            const course = instructorCourseList.find(course => course._id === currentEditedCourseId);
            students = course?.students            
        }
        
        const courseFinalFormData = {
            instructorId: auth?.user?._id,
            instructorName: auth?.user?.userName,
            date: new Date(),
            ...courseLandingFormData,
            students: students,
            curriculum: courseCurriculumFormData,
            isPublished: isPublished,
        }
        
        const response = 
        currentEditedCourseId !== null ? await updateCourseByIdService(currentEditedCourseId, courseFinalFormData) :
        await addNewCourseService(courseFinalFormData);

        if(response.success) {
            setCourseLandingFormData(courseCurriculumInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate(-1);
            setCurrentEditedCourseId(null);
        }
        
    }

    async function fetchCurrentCourseDetails() {
        const response = await fetchInstructorCourseDetailsService(currentEditedCourseId)

        if(response.success) {
            const setCourseFormData = Object.keys(courseLandingInitialFormData).reduce((acc, key)=> {
                acc[key] = response?.data[key] || courseLandingInitialFormData[key]

                return acc
            }, {})

            setCourseLandingFormData(setCourseFormData);
            setCourseCurriculumFormData(response?.data?.curriculum);
            setIsPublished(response?.data?.isPublished)
        }
    }

    useEffect(()=> {
        if(currentEditedCourseId) fetchCurrentCourseDetails()
    },[currentEditedCourseId])

    useEffect(()=> {
        if(params?.courseId) setCurrentEditedCourseId(params?.courseId)
    },[params?.courseId])

    return <div className="container mx-auto p-4">
        <div className="flex justify-between">
            <h1 className="text-3xl font-extrabold mb-5">{currentEditedCourseId ? "Edit course" : "Create a new course"}</h1>
            <Button disabled={!validateFormData()}
             className="text-sm tracking-wider font-bold px-8"
             onClick={handleCreateCourse}
             >
                SUBMIT
            </Button>
        </div>
        <Card>
            <CardContent>
                <div className="container mx-auto p-4">
                    <Tabs defaultValue="curriculum" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <TabsList>
                                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                                <TabsTrigger value="course-landing-page">Course Landing Page</TabsTrigger>
                                <TabsTrigger value="settings">Settings</TabsTrigger>
                            </TabsList>
                            <div className="flex items-center space-x-2">
                                    <Switch
                                    onCheckedChange={handleIsPublishedChange}
                                    checked={isPublished}
                                    id="isPublished"
                                    />
                                    <Label htmlFor="isPublished">Published</Label>
                            </div>
                        </div>

                        <TabsContent value="curriculum">
                            <CourseCurriculum/>
                        </TabsContent>

                        <TabsContent value="course-landing-page">
                            <CourseLanding/>
                        </TabsContent>

                        <TabsContent value="settings">
                            <CourseSettings/>
                        </TabsContent>
                    </Tabs>
                </div>
            </CardContent>
        </Card>
    </div>
}

export default AddNewCoursePage;