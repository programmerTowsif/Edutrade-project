 
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());
app.use(express.json());

// Frontend files serve করার জন্য
app.use(express.static(__dirname));


// =====================================
// TEMPORARY DATA
// =====================================

// Users
let users = [];
let nextId = 1;

// Posts
let posts = [];
let nextPostId = 1;


// =====================================
// CREATE USER - POST
// =====================================

app.post("/api/users", (req, res) => {

    const {
        fullName,
        email,
        studentId,
        phone,
        university,
        department,
        password,
        confirmPassword,
        profileImage,
        agree
    } = req.body;


    // -----------------------------
    // Required field validation
    // -----------------------------

    if (
        !fullName ||
        !email ||
        !studentId ||
        !phone ||
        !university ||
        !department ||
        !password ||
        !confirmPassword
    ) {
        return res.status(400).json({
            success: false,
            message: "Please fill up all required fields"
        });
    }


  


    // -----------------------------
    // Password validation
    // -----------------------------

    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters"
        });
    }


    // -----------------------------
    // Confirm password
    // -----------------------------

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Passwords do not match"
        });
    }


    // -----------------------------
    // Terms validation
    // -----------------------------

    if (agree !== true) {
        return res.status(400).json({
            success: false,
            message:
                "You must agree to the Terms and Privacy Policy"
        });
    }


    // -----------------------------
    // Duplicate email
    // -----------------------------

    const emailExists = users.some(
        user =>
            user.email.toLowerCase() ===
            email.toLowerCase()
    );

    if (emailExists) {
        return res.status(409).json({
            success: false,
            message:
                "This email is already registered"
        });
    }


    // -----------------------------
    // Duplicate student ID
    // -----------------------------

    const studentIdExists = users.some(
        user =>
            user.studentId === studentId
    );

    if (studentIdExists) {
        return res.status(409).json({
            success: false,
            message:
                "This Student ID is already registered"
        });
    }


    // -----------------------------
    // Create new user
    // -----------------------------

    const newUser = {

        id: nextId++,

        fullName,

        email: email.toLowerCase(),

        studentId,

        phone,

        university,

        department,

        password,

        profileImage:
            profileImage || "",

        agree: true,

        posts: [],

        createdAt: new Date()

    };


    // Add user
    users.push(newUser);


    console.log("New user registered:");
    console.log(newUser);


    // -----------------------------
    // Success response
    // -----------------------------

    res.status(201).json({

        success: true,

        message:
            "Account created successfully",

        user: newUser

    });

});


// =====================================
// GET ALL USERS
// =====================================

app.get("/api/users", (req, res) => {

    res.json({

        success: true,

        count: users.length,

        users: users

    });

});


// =====================================
// GET SINGLE USER
// =====================================

app.get("/api/users/:id", (req, res) => {

    const id =
        Number(req.params.id);


    const user =
        users.find(
            user => user.id === id
        );


    if (!user) {

        return res.status(404).json({

            success: false,

            message: "User not found"

        });

    }


    res.json({

        success: true,

        user: user

    });

});


// =====================================
// UPDATE USER - PUT
// =====================================

app.put("/api/users/:id", (req, res) => {

    const id =
        Number(req.params.id);


    const user =
        users.find(
            user => user.id === id
        );


    if (!user) {

        return res.status(404).json({

            success: false,

            message: "User not found"

        });

    }


    const {
        fullName,
        email,
        studentId,
        phone,
        university,
        department,
        password,
        profileImage
    } = req.body;


    // -----------------------------
    // Update full name
    // -----------------------------

    if (fullName !== undefined) {

        user.fullName =
            fullName;

    }


    // -----------------------------
    // Update email
    // -----------------------------

    if (email !== undefined) {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid email address"

            });

        }


        const emailExists =
            users.some(
                otherUser =>
                    otherUser.id !== user.id &&
                    otherUser.email.toLowerCase() ===
                    email.toLowerCase()
            );


        if (emailExists) {

            return res.status(409).json({

                success: false,

                message:
                    "This email is already registered"

            });

        }


        user.email =
            email.toLowerCase();

    }


    // -----------------------------
    // Update student ID
    // -----------------------------

    if (studentId !== undefined) {

        const studentIdExists =
            users.some(
                otherUser =>
                    otherUser.id !== user.id &&
                    otherUser.studentId === studentId
            );


        if (studentIdExists) {

            return res.status(409).json({

                success: false,

                message:
                    "This Student ID is already registered"

            });

        }


        user.studentId =
            studentId;

    }


    // -----------------------------
    // Update phone
    // -----------------------------

    if (phone !== undefined) {

        user.phone =
            phone;

    }


    // -----------------------------
    // Update university
    // -----------------------------

    if (university !== undefined) {

        user.university =
            university;

    }


    // -----------------------------
    // Update department
    // -----------------------------

    if (department !== undefined) {

        user.department =
            department;

    }


    // -----------------------------
    // Update password
    // -----------------------------

    if (password !== undefined) {

        if (password.length < 8) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 8 characters"

            });

        }


        user.password =
            password;

    }


    // -----------------------------
    // Update profile image
    // -----------------------------

    if (profileImage !== undefined) {

        user.profileImage =
            profileImage;

    }


    // -----------------------------
    // Response
    // -----------------------------

    res.json({

        success: true,

        message:
            "User updated successfully",

        user: user

    });

});


// =====================================
// DELETE USER
// =====================================

app.delete("/api/users/:id", (req, res) => {

    const id =
        Number(req.params.id);


    const index =
        users.findIndex(
            user => user.id === id
        );


    if (index === -1) {

        return res.status(404).json({

            success: false,

            message: "User not found"

        });

    }


    const deletedUser =
        users.splice(index, 1)[0];


    res.json({

        success: true,

        message:
            "User deleted successfully",

        user: deletedUser

    });

});


// =====================================
// LOGIN
// =====================================

app.post("/api/login", (req, res) => {

    const {
        email,
        password
    } = req.body;


    console.log("LOGIN REQUEST:");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Users:", users);


    // -----------------------------
    // Required validation
    // -----------------------------

    if (!email || !password) {

        return res.status(400).json({

            success: false,

            message:
                "Email and password are required"

        });

    }


    // -----------------------------
    // Find user
    // -----------------------------

    const user =
        users.find(
            user =>
                user.email.toLowerCase() ===
                email.toLowerCase()
        );


    if (!user) {

        console.log("USER NOT FOUND");

        return res.status(401).json({

            success: false,

            message:
                "Invalid email or password"

        });

    }


    // -----------------------------
    // Check password
    // -----------------------------

    if (user.password !== password) {

        console.log("WRONG PASSWORD");

        return res.status(401).json({

            success: false,

            message:
                "Invalid email or password"

        });

    }


    console.log("LOGIN SUCCESS");


    // -----------------------------
    // Don't send password
    // -----------------------------

    const loggedInUser = {

        id: user.id,

        fullName: user.fullName,

        email: user.email,

        studentId: user.studentId,

        phone: user.phone,

        university: user.university,

        department: user.department,

        profileImage: user.profileImage

    };


    res.json({

        success: true,

        message:
            "Login successful",

        user: loggedInUser

    });

});


// =====================================
// CREATE POST
// =====================================

app.post("/api/posts", (req, res) => {

    const {
        userId,
        title,
        listingType,
        category,
        price,
        condition,
        contact,
        location,
        description,
        image
    } = req.body;


    // -----------------------------
    // Required field validation
    // -----------------------------

    if (
        !userId ||
        !title ||
        !listingType ||
        !category ||
        !condition ||
        !contact ||
        !location ||
        !description
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Please fill up all required fields"

        });

    }


    // -----------------------------
    // Find user
    // -----------------------------

    const user =
        users.find(
            user =>
                String(user.id) ===
                String(userId)
        );


    if (!user) {

        return res.status(404).json({

            success: false,

            message:
                "User not found"

        });

    }


    // -----------------------------
    // Create post
    // -----------------------------

    const newPost = {

        postId: nextPostId++,

        userId: user.id,

        authorName:
            user.fullName,

        title,

        listingType,

        category,

        price:
            Number(price) || 0,

        condition,

        contact,

        location,

        description,

        image:
            image || "",

        createdAt:
            new Date().toLocaleString()

    };


    // Add to global posts
    posts.push(newPost);


    // -----------------------------
    // Add post to user
    // -----------------------------

    if (!Array.isArray(user.posts)) {

        user.posts = [];

    }


    user.posts.push(newPost);


    console.log(
        "New post created:",
        newPost
    );


    // -----------------------------
    // Success response
    // -----------------------------

    res.status(201).json({

        success: true,

        message:
            "Post created successfully",

        post:
            newPost

    });

});


// =====================================
// GET ALL POSTS
// =====================================

app.get("/api/posts", (req, res) => {

    res.json({

        success: true,

        count: posts.length,

        posts: posts

    });

});


// =====================================
// GET SINGLE POST
// =====================================

app.get("/api/posts/:id", (req, res) => {

    const id =
        Number(req.params.id);


    const post =
        posts.find(
            post =>
                post.postId === id
        );


    if (!post) {

        return res.status(404).json({

            success: false,

            message:
                "Post not found"

        });

    }


    res.json({

        success: true,

        post:
            post

    });

});


// =====================================
// UPDATE POST
// =====================================

app.put("/api/posts/:id", (req, res) => {

    const id =
        Number(req.params.id);


    const postIndex =
        posts.findIndex(
            post =>
                post.postId === id
        );


    if (postIndex === -1) {

        return res.status(404).json({

            success: false,

            message:
                "Post not found"

        });

    }


    const post =
        posts[postIndex];


    const {
        userId,
        title,
        listingType,
        category,
        price,
        condition,
        contact,
        location,
        description,
        image
    } = req.body;


    // -----------------------------
    // Check owner
    // -----------------------------

    if (
        String(post.userId) !==
        String(userId)
    ) {

        return res.status(403).json({

            success: false,

            message:
                "You are not allowed to edit this post"

        });

    }


    // -----------------------------
    // Update post
    // -----------------------------

    if (title !== undefined) {

        post.title =
            title;

    }


    if (listingType !== undefined) {

        post.listingType =
            listingType;

    }


    if (category !== undefined) {

        post.category =
            category;

    }


    if (price !== undefined) {

        post.price =
            Number(price) || 0;

    }


    if (condition !== undefined) {

        post.condition =
            condition;

    }


    if (contact !== undefined) {

        post.contact =
            contact;

    }


    if (location !== undefined) {

        post.location =
            location;

    }


    if (description !== undefined) {

        post.description =
            description;

    }


    if (image !== undefined) {

        post.image =
            image;

    }


    // -----------------------------
    // Update user's copy
    // -----------------------------

    const user =
        users.find(
            user =>
                String(user.id) ===
                String(post.userId)
        );


    if (
        user &&
        Array.isArray(user.posts)
    ) {

        const userPostIndex =
            user.posts.findIndex(
                userPost =>
                    userPost.postId ===
                    post.postId
            );


        if (userPostIndex !== -1) {

            user.posts[userPostIndex] =
                post;

        }

    }


    console.log(
        "Post updated:",
        post
    );


    // -----------------------------
    // Response
    // -----------------------------

    res.json({

        success: true,

        message:
            "Post updated successfully",

        post:
            post

    });

});


// =====================================
// DELETE POST
// =====================================

app.delete("/api/posts/:id", (req, res) => {

    const id =
        Number(req.params.id);


    const postIndex =
        posts.findIndex(
            post =>
                post.postId === id
        );


    if (postIndex === -1) {

        return res.status(404).json({

            success: false,

            message:
                "Post not found"

        });

    }


    const deletedPost =
        posts[postIndex];


    // -----------------------------
    // Check owner
    // -----------------------------

    const {
        userId
    } = req.body;


    if (
        String(deletedPost.userId) !==
        String(userId)
    ) {

        return res.status(403).json({

            success: false,

            message:
                "You are not allowed to delete this post"

        });

    }


    // -----------------------------
    // Remove from posts array
    // -----------------------------

    posts.splice(
        postIndex,
        1
    );


    // -----------------------------
    // Remove from user's posts
    // -----------------------------

    const user =
        users.find(
            user =>
                String(user.id) ===
                String(deletedPost.userId)
        );


    if (
        user &&
        Array.isArray(user.posts)
    ) {

        user.posts =
            user.posts.filter(
                post =>
                    post.postId !==
                    deletedPost.postId
            );

    }


    console.log(
        "Post deleted:",
        deletedPost
    );


    // -----------------------------
    // Response
    // -----------------------------

    res.json({

        success: true,

        message:
            "Post deleted successfully",

        post:
            deletedPost

    });

});


// =====================================
// START SERVER
// =====================================

app.listen(PORT, () => {

    console.log("");

    console.log(
        "================================="
    );

    console.log(
        "EduTrade Server Started"
    );

    console.log(
        "================================="
    );

    console.log(
        `Server: http://localhost:${PORT}`
    );

    console.log(
        `Register: http://localhost:${PORT}/pages/register.html`
    );

    console.log(
        "================================="
    );

    console.log("");

});
 

 