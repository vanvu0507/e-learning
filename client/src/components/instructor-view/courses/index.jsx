import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Delete, Edit } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCourseService, updateCourseByIdService } from "@/services";

function InstructorCourses({ listOfCourses, onCourseChanged }) {
    const navigate = useNavigate();
    const { setCurrentEditedCourseId, setCourseLandingFormData, setCourseCurriculumFormData } = useContext(InstructorContext);
    const [deletingCourseId, setDeletingCourseId] = useState(null);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [unpublishDialogOpen, setUnpublishDialogOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const handleDeleteCourse = async (courseId) => {
        const course = listOfCourses.find(course => course._id === courseId);
        setSelectedCourse(course);
        setConfirmDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedCourse?.students.length === 0) {
            await deleteCourse();
        } else {
            setConfirmDeleteDialogOpen(false);
            setUnpublishDialogOpen(true);
        }
    };

    const deleteCourse = async () => {
        try {
            setDeletingCourseId(selectedCourse._id);
            await deleteCourseService(selectedCourse._id);
            if(onCourseChanged) {
                onCourseChanged();
            }
            alert("Course deleted successfully");
        } catch (error) {
            console.error("Failed to delete course:", error);
        } finally {
            setDeletingCourseId(null);
            setConfirmDeleteDialogOpen(false);
        }
    };

    const handleUnpublishCourse = async () => {
        try {
            await updateCourseByIdService(selectedCourse._id, { isPublished: false });
            alert("Course unpublished successfully");
            if(onCourseChanged) {
                onCourseChanged();
            }
        } catch (error) {
            console.error("Failed to unpublish course:", error);
        } finally {
            setUnpublishDialogOpen(false);
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
                                <TableHead>Published</TableHead>
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
                                        <TableCell>{course?.isPublished ? "Yes" : "No"}</TableCell>
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

            {/* Confirm Delete Dialog */}
            <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this course?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setConfirmDeleteDialogOpen(false)} variant="outline">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmDelete}>Yes, Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Unpublish Course Dialog */}
            <Dialog open={unpublishDialogOpen} onOpenChange={setUnpublishDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cannot Delete Published Course</DialogTitle>
                        <DialogDescription>This course has students enrolled. Would you like to unpublish it instead?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setUnpublishDialogOpen(false)} variant="outline">
                            No, Keep Published
                        </Button>
                        <Button onClick={handleUnpublishCourse}>Yes, Unpublish</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

export default InstructorCourses;
