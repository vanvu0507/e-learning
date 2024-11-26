
const Course = require('../../models/Course');
const StudentCourses = require('../../models/StudentCourses');

const getAllStudentViewCourses = async (req, res) => {
    try {
        const {
            category = [],
            level = [],
            // title = "",
            // instructorName = "",
            primaryLanguage = [],
            sortBy = "price-lowtohigh",
            searchQuery = {} // Query tìm kiếm tổng hợp
        } = req.query;

        // Lọc điều kiện cụ thể
        let filters = {};
        // if (category.length) {
        //     filters.category = { $in: category.split(',') };
        // }
        // if (level.length) {
        //     filters.level = { $in: level.split(',') };
        // }
        // if (primaryLanguage.length) {
        //     filters.primaryLanguage = { $in: primaryLanguage.split(',') };
        // }

        // Tìm kiếm sự tương đồng dựa trên searchQuery
        if (Object.keys(searchQuery).length > 0) {            
            console.log(searchQuery);
            const keywords = searchQuery.trim().split(/\s+/); // Tách từ khóa theo khoảng trắng
            filters.$or = keywords.map((keyword) => ({
                $or: [
                    { title: { $regex: keyword, $options: "i" } },
                    { instructorName: { $regex: keyword, $options: "i" } },
                    { category: { $regex: keyword, $options: "i" } }
                ]
            }));

            if (category.length) {
                filters.category = { $in: category.split(',') };
            }
            if (level.length) {
                filters.level = { $in: level.split(',') };
            }
            if (primaryLanguage.length) {
                filters.primaryLanguage = { $in: primaryLanguage.split(',') };
            }
            
        } else {
            // Tìm kiếm chính xác theo title hoặc instructorName nếu có
            if (category.length) {
                filters.category = { $in: category.split(',') };
            }
            if (level.length) {
                filters.level = { $in: level.split(',') };
            }
            if (primaryLanguage.length) {
                filters.primaryLanguage = { $in: primaryLanguage.split(',') };
            }
        }

        // Tham số sắp xếp
        let sortParam = {};
        switch (sortBy) {
            case 'price-lowtohigh':
                sortParam.pricing = 1;
                break;
            case 'price-hightolow':
                sortParam.pricing = -1;
                break;
            case 'title-atoz':
                sortParam.title = 1;
                break;
            case 'title-ztoa':
                sortParam.title = -1;
                break;
            default:
                sortParam.pricing = 1;
                break;
        }

        // Truy vấn cơ sở dữ liệu
        const coursesList = await Course.find(filters).sort(sortParam);

        res.status(200).json({
            success: true,
            data: coursesList
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: 'Some error occurred!'
        });
    }
};


const getStudentViewCourseDetails = async(req,res) => {
    try {
        const { id } = req.params;      
        const courseDetails = await Course.findById(id);

        if(!courseDetails) {
            return res.status(404).json({
                success: false, 
                message: 'No course details found',
                data: null
            }) 
        }

        res.status(200).json({
            success: true, 
            data: courseDetails,
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })
    }
};

const getSuggestionCourses = async (req, res) => {
    try {
        const query = req.query.query;
        
        if (!query) {
            return res.status(400).json({ message: 'Query không hợp lệ' });
        }

        // Tìm kiếm khóa học dựa trên tên khóa học
        const searchResults = await Course.find({
            title: { $regex: query, $options: 'i' } // Tìm kiếm không phân biệt chữ hoa chữ thường
        }).limit(5); // Giới hạn kết quả tìm kiếm là 5 gợi ý

        // Trả về danh sách khóa học gợi ý
        res.status(200).json({ success: true, data: searchResults });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

const searchCourses = async (req, res) => {
    try {
        const query = req.query.query; // Lấy từ khóa tìm kiếm từ query params
        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Query không hợp lệ"
            });
        }

        // Tạo điều kiện tìm kiếm dựa trên sự tương đồng với các trường
        const searchConditions = {
            $or: [
                { title: { $regex: query, $options: "i" } }, // Tìm kiếm theo title
                { instructorName: { $regex: query, $options: "i" } }, // Tìm kiếm theo author
                { category: { $regex: query, $options: "i" } }, // Tìm kiếm theo category
                { level: { $regex: query, $options: "i" } } // Tìm kiếm theo level
            ]
        };

        // Tìm kiếm khóa học dựa trên các điều kiện
        const searchResults = await Course.find(searchConditions).limit(10); // Giới hạn số kết quả trả về

        if (searchResults.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy khóa học phù hợp"
            });
        }

        // Trả về kết quả tìm kiếm
        res.status(200).json({
            success: true,
            data: searchResults
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};

const checkCoursePurchaseInfo = async(req, res) => {
    try {

        const { id, studentId } = req.params;
        const studentCourses = await StudentCourses.findOne({
            userId: studentId,
        });
        const ifStudentAlreadyBoughtCurrentCourse = studentCourses.courses.findIndex(item => item.courseId === id) > -1;
        res.status(200).json({
            success: true, 
            data: ifStudentAlreadyBoughtCurrentCourse,
        })  ;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occured!'
        })  
    }
}

module.exports = { getAllStudentViewCourses, getStudentViewCourseDetails, getSuggestionCourses, searchCourses, checkCoursePurchaseInfo };