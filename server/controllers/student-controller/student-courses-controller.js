const StudentCourses = require('../../models/StudentCourses');

const getCoursesByStudentId = async(req,res) => {
    try {
        const {studentId} = req.params;

        const studentBoughtCourses = await StudentCourses.findOne({
                userId: studentId
        });

        res.status(200).json({
            success: true,
            data: studentBoughtCourses.courses
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })
    }
};

const createStudentCourse = async (req, res) => {
    try {
        const { studentId } = req.params;

        let studentCourses = await StudentCourses.findOne({ userId: studentId });
        console.log(studentCourses);
        
        if (studentCourses) {
            return res.status(400).json({
                success: false,
                message: 'Student course record already exists!'
            });
        }

        studentCourses = new StudentCourses({
            userId: studentId,
            courses: []
        });

        await studentCourses.save();

        res.status(201).json({
            success: true,
            message: 'Student course record created successfully!',
            data: studentCourses
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred!'
        });
    }
};

module.exports = {getCoursesByStudentId, createStudentCourse};