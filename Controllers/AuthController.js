
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require("../Models/User");

// const signup = async (req, res) => {
//     try {
//         const { name, email, password,role } = req.body;
//         if (!name || !email || !password || !role) {
//             return res.status(400).json({ message: 'All fields are required.' });
//         }
//         const user = await User.findOne({ email });
//         if (user) {
//             return res.status(409)
//                 .json({ message: 'User already exists, you can login', success: false });
//         }
//         const userModel = new User({ name, email, password, role });
//         userModel.password = await bcrypt.hash(password, 10);
//         await userModel.save();

//         const response = {
//             message: "Signup successfully",
//             success: true
//         };
//         console.log("Signup Response:", response); // Log the response
//         res.status(201).json(response);
//     } catch (err) {
//         console.error("Signup Error:", err); // Log the error
//         res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// };

// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         const errorMsg = 'Auth failed, email or password is wrong';
//         if (!user) {
//             return res.status(403)
//                 .json({ message: errorMsg, success: false });
//         }
//         const isPassEqual = await bcrypt.compare(password, user.password);
//         if (!isPassEqual) {
//             return res.status(403)
//                 .json({ message: errorMsg, success: false });
//         }
//         const jwtToken = jwt.sign(
//             { email: user.email, _id: user._id ,role: user.role},
//             process.env.JWT_SECRET,
//             { expiresIn: '24h' }
//         );

//         const response = {
//             message: "Login Success",
//             success: true,
//             jwtToken,
//             email,
//             name: user.name,
//             role: user.role 
//         };
//         console.log("Login Response:", response); // Log the response
//         res.status(200).json(response);
//     } catch (err) {
//         console.error("Login Error:", err); // Log the error
//         res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// };

// module.exports = {
//     signup,
//     login
// };

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../Models/User");

const createAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: "admin" });
        if (adminExists) {
            console.log("Admin already exists.");
            return;
        }
        const hashedPassword = await bcrypt.hash("kbjg rghr yfzb kvnj", 10);
        const admin = new User({
            name: "Admin",
            email: "rajarajeswari169@gmail.com",
            password: hashedPassword,
            role: "admin"
        });
        await admin.save();
        console.log("Admin user created successfully.");
    } catch (error) {
        console.error("Error creating admin:", error);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const errorMsg = 'Auth failed, email or password is wrong';
        if (!user) {
            return res.status(403).json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const response = {
            message: "Login Success",
            success: true,
            jwtToken,
            email,
            name: user.name,
            role: user.role
        };
        console.log("Login Response:", response);
        res.status(200).json(response);
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

module.exports = {
    createAdmin,
    login
};
