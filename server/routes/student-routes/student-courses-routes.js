const express = require('express');
const {getCoursesByStudentId, createStudentCourse} = require('../../controllers/student-controller/student-courses-controller');

const router = express.Router();

router.get('/get/:studentId', getCoursesByStudentId);
router.post('/create/:studentId', createStudentCourse);

module.exports = router;
