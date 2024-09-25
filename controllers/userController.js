//Async-Handler will handle error no need to define try catch block
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

//@desc register a new user
//@routes POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body; //Destructuring from the req.body
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All Feild is madatory");
    }
    // checking for user is already registered or not in DB
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered");
    }
    //Hash password
    const hashedpassword = await bcrypt.hash(password, 10);
    console.log("hashedpassword :", hashedpassword);

    // storing data to mongodb
    const user = await User.create({
        username,
        email,
        password: hashedpassword,
    });
    console.log(`User created ${user}`);

    // if use is succesfully registered then
    if (user) {
        res.status(201).json({ _id: user.id, email: user.email });
    } else {
        res.status(400)
        throw new Error("User data is not valid");   //if not registered
    }
    res.status(200).json({ message: "Register a new user" });
});


//@desc Login user
//@routes POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    //JWT
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400);
        throw new Error("All feilds are mandatory");
    }
    const user = await User.findOne({ email });
    //Compare password with hashpassword
    if (user && (await bcrypt.compare(password, user.password))) {
        //Creating accessToken using jsonwebtoken
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            }
        },
            process.env.ACCESS_TOKEN_SECERET,
            //accessToken will expire in
            { expiresIn: "20m" }
        );
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("email or password is not valid")
    }
    res.json({ message: "Login user" });
});



//@desc current user
//@routes GET  /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        information : req.user
    });
});



module.exports = { registerUser, loginUser, currentUser }