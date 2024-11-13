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
        console.log('USER ID: ' + studentId);
        
        // Kiểm tra xem người dùng đã có document StudentCourses chưa
        const existingStudentCourses = await StudentCourses.findOne({ studentId });
        if (existingStudentCourses) {
            return res.status(400).json({
                success: false,
                message: 'StudentCourses đã tồn tại cho người dùng này'
            });
        }

        // Tạo document StudentCourses mới cho người dùng
        const newStudentCourses = new StudentCourses({
            userId: studentId,
            courses: []  // Mảng khóa học khởi tạo rỗng
        });

        await newStudentCourses.save();

        res.status(201).json({
            success: true,
            message: 'StudentCourses được tạo thành công!',
            data: newStudentCourses
        });
    } catch (error) {
        console.error(error);  // Thêm dòng này để log lỗi chi tiết
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi tạo StudentCourses',
            error: error.message
        });
    }
};

module.exports = {getCoursesByStudentId, createStudentCourse};