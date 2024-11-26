import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Users, BookOpen, Calendar, CheckCircle } from "lucide-react";

function InstructorDashboard({ listOfCourses }) {

    // Tính toán các thống kê
    function calculateTotalStudentsAndProfit() {
        const { totalStudents, totalProfit, studentList, totalCourses, publishedCourses, unpublishedCourses, avgStudentsPerCourse, topCourses } = listOfCourses.reduce((acc, course) => {
            const studentCount = course.students.length;
            acc.totalStudents += studentCount;
            acc.totalProfit += course.pricing * studentCount;
            acc.totalCourses += 1;
            if (course.isPublished) acc.publishedCourses += 1;
            else acc.unpublishedCourses += 1;
    
            acc.avgStudentsPerCourse = acc.totalStudents / acc.totalCourses;
    
            course.students.forEach(student => {
                acc.studentList.push({
                    courseTitle: course.title,
                    studentName: student.studentName,
                    studentEmail: student.studentEmail,
                });
            });
            
            acc.topCourses = listOfCourses.map(course => ({
                ...course,
                revenue: course.pricing * course.students.length,
            })).sort((a, b) => b.revenue - a.revenue).slice(0, 3);            
    
            return acc;
        }, {
            totalStudents: 0,
            totalProfit: 0,
            studentList: [],
            totalCourses: 0,
            publishedCourses: 0,
            unpublishedCourses: 0,
            avgStudentsPerCourse: 0,
            topCourses: null,
        });
    
        return {
            totalProfit,
            totalStudents,
            studentList,
            totalCourses,
            publishedCourses,
            unpublishedCourses,
            avgStudentsPerCourse,
            topCourses,
        };
    }
    

    const { 
        totalProfit, 
        totalStudents, 
        studentList, 
        totalCourses, 
        publishedCourses, 
        unpublishedCourses, 
        avgStudentsPerCourse, 
        topCourses
    } = calculateTotalStudentsAndProfit();

    const config = [
        {
            icon: Users,
            label: "Total Students",
            value: totalStudents
        },
        {
            icon: DollarSign,
            label: "Total Revenue",
            value: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(totalProfit)
        },
        {
            icon: BookOpen,
            label: "Total Courses",
            value: totalCourses
        },
        {
            icon: Calendar,
            label: "Published Courses",
            value: publishedCourses
        },
        {
            icon: Calendar,
            label: "Unpublished Courses",
            value: unpublishedCourses
        },
        {
            icon: CheckCircle,
            label: "Average Students per Course",
            value: Math.round(avgStudentsPerCourse)
        },
    ];

    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {
                config.map((item, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {item.label}
                            </CardTitle>
                            <item.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {item.value}
                            </div>
                        </CardContent>
                    </Card>
                ))
            }
        </div>

        <Card className="mb-8">
    <CardHeader>
        <CardTitle>Top 3 Courses</CardTitle>
    </CardHeader>
    <CardContent>
        {topCourses && topCourses.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left"></th>
                            <th className="px-4 py-2 text-left">Title</th>
                            <th className="px-4 py-2 text-left">Category</th>
                            <th className="px-4 py-2 text-left">Instructor</th>
                            <th className="px-4 py-2 text-left">Students</th>
                            <th className="px-4 py-2 text-left">Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topCourses.map((course, index) => (
                            <tr key={index} className="border-b">
                                <td className="px-4 py-2">#{index + 1}</td>
                                <td className="px-4 py-2">{course.title}</td>
                                <td className="px-4 py-2">{course.category}</td>
                                <td className="px-4 py-2">{course.instructorName || "Unknown"}</td>
                                <td className="px-4 py-2">{course.students.length}</td>
                                <td className="px-4 py-2">{
                                    new Intl.NumberFormat('en-EN', {
                                        style: 'currency',
                                        currency: 'USD',
                                    }).format(course.pricing * course.students.length)
                                }</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div>No top courses</div>
        )}
    </CardContent>
</Card>


        <Card>
            <CardHeader>
                <CardTitle>Students List</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course Name</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Student Email</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                studentList.map((studentItem, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">
                                            {studentItem.courseTitle}
                                        </TableCell>
                                        <TableCell>
                                            {studentItem.studentName}
                                        </TableCell>
                                        <TableCell>
                                            {studentItem.studentEmail}
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    </div>;
}

export default InstructorDashboard;
