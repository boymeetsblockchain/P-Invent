const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const generateToken =(id)=>{
  return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1d"})
}


const registerUser = asyncHandler(async (req, res) => {
const {name,email,password} =req.body

// simple validation

if(!name|| !email ||!password){
  res.status(400)
  throw new Error ("Please fill in all fields")
}
if (password.length < 6) {
  res.status(400);
  throw new Error("Password must be up to 6 characters");
}

// Check if user email already exists
const userExists = await User.findOne({ email });

if (userExists) {
  res.status(400);
  throw new Error("Email has already been registered");
}


// create new user
const user = await User.create({
  name,
  email,
  password
});

// generate token
const token = generateToken(user._id)
// send HTTP only cookie
res.cookie("token",token,{
  path:'/',
  httpOnly:true,
  expires: new Date(Date.now() + 1000 * 86400),
  sameSite: "none",
  secure: true
})
if (user) {
  const { _id, name, email, photo, phone, bio } = user;
  res.status(201).json({
    _id,
    name,
    email,
    photo,
    phone,
    bio,
    token
  });
} else {
  res.status(400);
  throw new Error("Invalid user data");
}
});

// Login user
const loginUser =asyncHandler(
  async(req,res)=>{
    const{email,password} =req.body

    // validate Request
    if(!email || !password){
      res.status(400);
      throw new Error("Please add email and password")
    }
    // check if user exists

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found, please signup");
  }
  
  // User exists, check if password is correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    // generate a token
    const token = generateToken(user._id);

    if(passwordIsCorrect){
      // Send HTTP-only cookie
     res.cookie("token", token, {
       path: "/",
       httpOnly: true,
       expires: new Date(Date.now() + 1000 * 86400), // 1 day
       sameSite: "none",
       secure: true,
     });
   }
    if (user && passwordIsCorrect) {
      const { _id, name, email, photo, phone, bio } = user;
      res.status(200).json({
        _id,
        name,
        email,
        photo,
        phone,
        bio,
        token,
      });
    } else {
      res.status(400);
      throw new Error("Invalid email or password");
    }
    

  }
) 

// logout user 
const logOut=asyncHandler(async(req,res)=>{
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Successfully Logged Out" });
})
 const  getUser =asyncHandler(async(req,res)=> {
    const user = await User.findById(req.user._id)
    if(user){
      const { _id, name, email, photo, phone, bio } = user;
      res.status(200).json({
        _id,
        name,
        email,
        photo,
        phone,
        bio
      })
    } else{
      res.status(400)
      throw new Error("user not found")
    }
 })
//  get login status
 const  loginStatus= asyncHandler(async(req,res)=>{
  const token = req.cookies.token
  if(!token){
    return res.json(false)
  }
   // verify token
   const verified = jwt.verify(token,process.env.JWT_SECRET)
   if(verified){
    return res.json(true)
   }
   return res.json(false)
 })

 const updateUser = asyncHandler(async(req,res)=>{
  res.send("update user")
 })
mongoose.set('strictQuery', true);

module.exports = {
  registerUser,
  loginUser,
  logOut,
  getUser,
  loginStatus,
  updateUser
};
