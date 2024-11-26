const express = require('express');
const { getStudentViewCourseDetails, getAllStudentViewCourses, checkCoursePurchaseInfo, getSuggestionCourses, searchCourses } = require('../../controllers/student-controller/course-controller');
const router = express.Router();

router.get('/get', getAllStudentViewCourses);
router.get('/get/details/:id', getStudentViewCourseDetails);
router.get('/search-suggestions', getSuggestionCourses);
router.get('/search-courses', searchCourses);
router.get('/purchase-info/:id/:studentId/', checkCoursePurchaseInfo);

module.exports = router;