const express = require("express");
const path = require("path");
const fs = require("fs");
const User = require("../model/user");
const router = express.Router();
const { upload } = require("../middleware/multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const bcrypt = require("bcrypt");
require("dotenv").config();


// router.post("/create-user", upload.single("file"), catchAsyncErrors(async (req, res, next) => {
//     console.log("Creating user...");
//     const { name, email, password } = req.body;

//     const userEmail = await User.findOne({ email });
//     if (userEmail) {
//         if (req.file) {
//             const filepath = path.join(__dirname, "../uploads", req.file.filename);
//             try {
//                 fs.unlinkSync(filepath);
//             } catch (err) {
//                 console.log("Error removing file:", err);
//                 return res.status(500).json({ message: "Error removing file" });
//             }
//         }
//         return next(new ErrorHandler("User already exists", 400));
//     }

//     let fileUrl = "";
//     if (req.file) {
//         fileUrl = path.join("uploads", req.file.filename);
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log("At Create ", "Password: ", password, "Hash: ", hashedPassword);

//     const user = await User.create({
//         name,
//         email,
//         password: hashedPassword,
//         avatar: {
//             public_id: req.file?.filename || "",
//             url: fileUrl,
//         },
//     }); 
//     console.log(user)
//     res.status(201).json({ success: true, user });
// }));

// // router.post("/login", catchAsyncErrors(async (req, res, next) => {
// //     console.log("Logging in user...");
// //     const { email, password } = req.body;
// //     if (!email || !password) {
// //         return next(new ErrorHandler("Please provide email and password", 400));
// //     }
// //     const user_authen = await User.findOne({ email }).select("+password");
// //     if (!user_authen) {
// //         return next(new ErrorHandler("Invalid Email or Password`", 401));
// //     }

// //     const isPasswordMatched = await bcrypt.compare(password, user_authen.password);

// //     console.log("Password Match Result:", isPasswordMatched);
// //     console.log("At Auth", "Password: ", password, "Hash: ", user_authen.password);
// //     if (!isPasswordMatched) {
// //         return next(new ErrorHandler("Invalid Email or Password", 401));
// //     }

// //     // if(user_authen && await bcrypt.compare(password, user_authen.password)){
// //     //     console.log(user_authen)
// //     // }else{
// //     //     console.log("Wrong password");
// //     // }
    
// //      console.log(user_authen)
// //     res.status(200).json({
// //         success: true,
// //         user_authen,
// //     });
// // }));


// router.post("/login", catchAsyncErrors(async (req, res, next) => {
//     console.log("Logging in user...");

//     const { email, password } = req.body;
//     console.log("Password from req.body:", password);


//     // Check if both email and password are provided
//     if (!email || !password) {
//         return next(new ErrorHandler("Please provide both email and password.", 400));
//     }

//     // Fetch the user by email, including the password field
//     const user_authen = await User.findOne({ email }).select("+password");

//     // Check if user exists
//     if (!user_authen) {
//         console.log("No user found with the provided email.");
//         return next(new ErrorHandler("No such email found. Please register first.", 401));
//     }

//     // Compare the provided password with the stored hashed password
//     const isPasswordMatched = await bcrypt.compare( password, user_authen.password);
//     console.log("Password Match Result:", isPasswordMatched);
//     console.log("At Auth - Password: ", password, "Hash: ", user_authen.password);

//     // Check if the password matches
//     if (!isPasswordMatched) {
//         console.log("Password mismatch.");
//         console.log(password, user_authen.password);
//         return next(new ErrorHandler("Authentication failed. Invalid password.", 401));
//     }

//     // Successful login
//     console.log("User authentication successful. User details:", user_authen);
//     res.status(200).json({
//         success: true,
//         message: "Login successful.",
//         user: {
//             id: user_authen._id,
//             email: user_authen.email,
//             name: user_authen.name, // Include other relevant user details as needed
//         },
//     });
// }));


router.post("/create-user", upload.single("file"), catchAsyncErrors(async (req, res, next) => {
    console.log("Creating user...");
    let { name, email, password } = req.body;

    // Trim the email and password to remove extra spaces
    email = email.trim();
    password = password.trim();

    const userEmail = await User.findOne({ email });
    if (userEmail) {
        if (req.file) {
            const filepath = path.join(__dirname, "../uploads", req.file.filename);
            try {
                fs.unlinkSync(filepath);
            } catch (err) {
                console.log("Error removing file:", err);
                return res.status(500).json({ message: "Error removing file" });
            }
        }
        return next(new ErrorHandler("User already exists", 400));
    }

    let fileUrl = "";
    if (req.file) {
        fileUrl = path.join("uploads", req.file.filename);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("At Create ", "Password: ", password, "Hash: ", hashedPassword);

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: req.file?.filename || "",
            url: fileUrl,
        },
    }); 
    console.log(user);
    res.status(201).json({ success: true, user });
}));

router.post("/login-user", catchAsyncErrors(async (req, res, next) => {
    console.log("Logging in user...");

    let { email, password } = req.body;
    email = email.trim();  // Ensure email is trimmed
    password = password.trim();  // Ensure password is trimmed

    if (!email || !password) {
        return next(new ErrorHandler("Please provide both email and password.", 400));
    }

    const user_authen = await User.findOne({ email }).select("+password");

    if (!user_authen) {
        console.log("No user found with the provided email.");
        return next(new ErrorHandler("No such email found. Please register first.", 401));
    }

    // Compare the plain password with the hashed password from the database
    const isPasswordMatched = await bcrypt.compare(password,user_authen.password);
    console.log("Password Match Result:", isPasswordMatched);
    console.log("At Auth - Password: ", password, "Hash: ", user_authen.password);

    if (!isPasswordMatched) {
        console.log("Password mismatch.");
        return next(new ErrorHandler("Authentication failed. Invalid password.", 401));
    }

    // Successful login
    res.status(200).json({
        success: true,
        message: "Login successful.",
        user: {
            id: user_authen._id,
            email: user_authen.email,
            name: user_authen.name, // Include other relevant user details as needed
        },
    });
}));

router.get("/profile", catchAsyncErrors(async (req, res, next) => {
    const { email } = req.query;
    if (!email) {
        return next(new ErrorHandler("Please provide an email", 400));
    }
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
        success: true,
        user: {
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            avatarUrl: user.avatar.url
        },
        addresses: user.addresses,
    });
}));





module.exports = router;