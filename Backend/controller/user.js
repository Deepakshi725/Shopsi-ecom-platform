const express = require("express");
const path = require("path");
const fs = require("fs");
const User = require("../model/user");
const router = express.Router();
const { upload } = require("../middleware/multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import JSON Web Token
require("dotenv").config();
const { isAuthenticatedUser } = require('../middleware/auth');


JWT_SECRET = "9f1e345b1a84a7c8d0b9e6f2e20dbb7e01c7aa40f7e3e2ad6e92750f60e4a2c9y"

// 1) Create user
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
            if (fs.existsSync(filepath)) {
                try {
                    fs.unlinkSync(filepath);
                } catch (err) {
                    console.log("Error removing file:", err);
                    return res.status(500).json({ message: "Error removing file" });
                }
            }
        }
        return next(new ErrorHandler("User already exists", 400));
    }

    // Set avatar information
    const avatar = {
        public_id: req.file ? req.file.filename : "default-avatar",
        url: req.file ? path.join("uploads", req.file.filename) : "uploads/default-avatar.png"
    };

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("At Create ", "Password: ", password, "Hash: ", hashedPassword);

    const user = await User.create({
        name,
        email,
        password,
        avatar
    }); 
    console.log(user);
    res.status(201).json({ success: true, user });
}));


// 2) Login
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


        // Generate JWT token
        const token = jwt.sign(
            { id: user_authen._id, email: user_authen.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          
        // Set token in an HttpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // use true in production
            sameSite: "Strict",
            path: "/",
            maxAge: 3600000, // 1 hour
        });


    // Successful login
    user_authen.password = undefined; // Remove password from response
    res.status(200).json({
        success: true,
        user_authen,
    });
}));
// 3) Get profile
router.get("/profile", isAuthenticatedUser, catchAsyncErrors(async (req, res, next) => {
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
            avatarUrl: user.avatar.url.replace(/\\/g, '/')
        },
        addresses: user.addresses,
    });
}));

// 4) Add address
router.post("/add-address",isAuthenticatedUser, catchAsyncErrors(async (req, res, next) => {
    const { country, city, address1, address2, zipCode, addressType, email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const newAddress = {
        country,
        city,
        address1,
        address2,
        zipCode,
        addressType
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
        success: true,
        addresses: user.addresses,
    });
}));

// 5) Get addresses
router.get("/addresses",isAuthenticatedUser, catchAsyncErrors(async (req, res, next) => {
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
        addresses: user.addresses,
    });
}
));

// 6) Update profile
router.put("/update-profile", isAuthenticatedUser, upload.single("file"), catchAsyncErrors(async (req, res, next) => {
    const { email } = req.query;
    if (!email) {
        return next(new ErrorHandler("Please provide an email", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Update basic info
    if (req.body.name) user.name = req.body.name;
    if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;

    // Handle avatar update
    if (req.file) {
        console.log("File received:", req.file);
        
        // Delete old avatar if exists
        if (user.avatar?.url) {
            const oldAvatarPath = path.join(__dirname, '..', user.avatar.url);
            console.log("Old avatar path:", oldAvatarPath);
            if (fs.existsSync(oldAvatarPath)) {
                fs.unlinkSync(oldAvatarPath);
            }
        }

        // Update with new avatar - ensure forward slashes in URL
        const fileUrl = path.join("uploads", req.file.filename).replace(/\\/g, '/');
        console.log("New file URL:", fileUrl);
        
        user.avatar = {
            public_id: req.file.filename,
            url: fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl
        };
        console.log("Updated avatar object:", user.avatar);
    } else if (!user.avatar || !user.avatar.url) {
        // Set default avatar if none exists
        user.avatar = {
            public_id: "default-avatar",
            url: "uploads/default-avatar.png"
        };
    }

    await user.save();

    res.status(200).json({
        success: true,
        user: {
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            avatarUrl: user.avatar.url.replace(/\\/g, '/')
        }
    });
}));

module.exports = router;