import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Delete, Edit } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCourseService, mediaDeleteService, updateCourseByIdService } from "@/services";

function InstructorCourses({ listOfCourses, onCourseChanged }) {
    const navigate = useNavigate();
    const { setCurrentEditedCourseId, setCourseLandingFormData, setCourseCurriculumFormData } = useContext(InstructorContext);
    const [deletingCourseId, setDeletingCourseId] = useState(null);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [unpublishDialogOpen, setUnpublishDialogOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // State lưu trữ giá trị tìm kiếm

    // Lọc các khóa học dựa trên tìm kiếm
    const filteredCourses = listOfCourses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    const extractPublicIdFromUrl = (url) => {
        if (!url) return null;

        const parts = url.split('/upload/');
        if (parts.length < 2) return null;

        const filePath = parts[1];
        const segments = filePath.split('/');
        const lastSegment = segments.pop();

        const publicId = lastSegment.split('.')[0];

        return publicId;
    };

    const deleteCourse = async () => {
        try {
            setIsDeleting(true);

            setDeletingCourseId(selectedCourse._id);

            const publicIds = selectedCourse.curriculum.map(lecture => lecture.public_id).filter(Boolean);
            const imagePublicId = extractPublicIdFromUrl(selectedCourse.image);
            if (imagePublicId) {
                publicIds.push(imagePublicId);
            }

            for (const publicId of publicIds) {
                await mediaDeleteService(publicId);
            }

            await deleteCourseService(selectedCourse._id);
            if (onCourseChanged) {
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
            if (onCourseChanged) {
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

                {/* Thanh tìm kiếm */}
                <input
                    type="text"
                    placeholder="Search by course name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                />

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
                            {filteredCourses && filteredCourses.length > 0 ? (
                                filteredCourses.map((course) => (
                                    <TableRow key={course._id}>
                                        <TableCell className="font-medium">{course?.title}</TableCell>
                                        <TableCell>{course?.students?.length}</TableCell>
                                        <TableCell>
                                            {new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: 'USD',
                                            }).format(course?.students?.length * course?.pricing)}
                                        </TableCell>
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
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="5" className="text-center">No courses found</TableCell>
                                </TableRow>
                            )}
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
                        <Button onClick={() => setConfirmDeleteDialogOpen(false)} disabled={isDeleting} variant="outline">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmDelete} disabled={isDeleting}>Yes, Delete</Button>
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
