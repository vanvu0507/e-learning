
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const registerUser = async(req, res) => {

    const {userName, userEmail, password, role} = req.body

    const existingUser = await User.findOne({$or: [{userEmail}, {userName}]})

    if(existingUser) {
        return res.status(400).json({
            success: false,
            message: 'User name or user email already existed'
        })
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({userName, userEmail, role, password: hashPassword})

    const savedUser = await newUser.save();

    // Gọi route tạo StudentCourses sau khi đăng ký thành công
    try {
        await axios.post(`http://localhost:5000/student/courses-bought/create/${savedUser._id}`);
    } catch (error) {
        console.log(error)
    }

    return res.status(201).json({
        success: true,
        message: 'User registered successfully!'
    })
};

const loginUser = async(req,res) => {
    const {userEmail, password} = req.body;
    const checkUser = await User.findOne({userEmail});

    if(!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        })
    }

    const accessToken = jwt.sign({
        _id: checkUser.id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role
    }, 'JWT_SECRET', {expiresIn: '120m'})

    res.status(200).json({
        success: true,
        message: 'Logged in successfully!',
        data: {
            accessToken,
            user: {
                _id: checkUser.id,
                userName: checkUser.userName,
                userEmail: checkUser.userEmail,
                role: checkUser.role
            }
        }
    })
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No users found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Fetched all users successfully!',
            data: users,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

module.exports = { registerUser, loginUser, getAllUsers };
