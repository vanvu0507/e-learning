import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Delete, Edit } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { deleteCourseService } from "@/services";

function InstructorCourses({ listOfCourses, onCourseDeleted }) {
    const navigate = useNavigate();
    const { setCurrentEditedCourseId, setCourseLandingFormData, setCourseCurriculumFormData } = useContext(InstructorContext);
    const [deletingCourseId, setDeletingCourseId] = useState(null);

    const handleDeleteCourse = async (courseId) => {
        try {
            setDeletingCourseId(courseId);
            await deleteCourseService(courseId);
            if (onCourseDeleted) {
                onCourseDeleted(courseId);
            }
        } catch (error) {
            console.error("Failed to delete course:", error);
        } finally {
            setDeletingCourseId(null);
        }
    };

    return (
        <Card>
            <CardHeader className="flex justify-between flex-row items-center">
                <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
                <Button
                    onClick={() => {
                        setCurrentEditedCourseId(null);
                        navigate('/instructor/create-new-course');
                        setCourseLandingFormData(courseLandingInitialFormData);
                        setCourseCurriculumFormData(courseCurriculumInitialFormData);
                    }}
                    className="p-6"
                >
                    Create New Course
                </Button>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course</TableHead>
                                <TableHead>Students</TableHead>
                                <TableHead>Revenue</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listOfCourses && listOfCourses.length > 0 ? (
                                listOfCourses.map((course) => (
                                    <TableRow key={course._id}>
                                        <TableCell className="font-medium">{course?.title}</TableCell>
                                        <TableCell>{course?.students?.length}</TableCell>
                                        <TableCell>${course?.students?.length * course?.pricing}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                onClick={() => {
                                                    navigate(`/instructor/edit-course/${course?._id}`);
                                                }}
                                                variant="ghost"
                                                size="sm"
                                            >
                                                <Edit className="h-6 w-6" />
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteCourse(course._id)}
                                                variant="ghost"
                                                size="sm"
                                                disabled={deletingCourseId === course._id}
                                            >
                                                <Delete className="h-6 w-6" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : null}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

export default InstructorCourses;
