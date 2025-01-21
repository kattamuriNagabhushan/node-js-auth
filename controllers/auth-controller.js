const User = require("../models/User")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const registerUser = async(req , res) =>{
    try {
        const { username , email , password , role } = req.body;

        //check user already existed or not 

        const checkExistingUser = await User.findOne({$or : [{username} , {email}]});


        if(checkExistingUser){
           return res.status(400).json({
                success : false,
                message : "user already exists with same username or same email"
            })
        } 

        //hash user pwsrd 

        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password , salt);

        //create a new user and save in ur db 

        const newCreatedUser = new User({username , email , password : hashedPassword , role : role || 'user'}) 
        await newCreatedUser.save()

        if(newCreatedUser){
            res.status(200).json({
                success : true , 
                message : 'user registered successfully',
                data : newCreatedUser
            })
        } else {
            res.status(400).json({
                success : false , 
                message : 'unable to register , please try again'
            })
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Some error occured"
        })
        
    }
}

const loginUser = async(req , res) =>{
    try {

        const  { username , password} = req.body;

        const user = await User.findOne({username});

        if(!user){
            return res.status(400).json({
                success : false ,
                message : "user doesn't exists "
            })
        }

        // if pswrd crt or not 
        const isPasswordMatch = await bcrypt.compare(password , user.password)

        if(!isPasswordMatch){
            return res.status(400).json({
                success : false ,
                message : "invalid username or password "
            })
        }
        
        //crete user token 

        const accessToken = jwt.sign({
            userId : user._id,
            username : user.username,
            role : user.role
        },process.env.JWT_SECRET_KEY, {
            expiresIn : '15m'
        })

        res.status(200).json({
            success : true,
            message : 'logged in successfully',
            accessToken
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Some error occured"
        })
    }
}


const changePassword = async(req , res) =>{

    try {
        const userId = req.userInfo.userId;

        console.log(userId);
        
        const {oldPassword , newPassword} = req.body;

        console.log(`${oldPassword} , ${newPassword}`);
        
        //find the current logged in user

        const user = await User.findById(userId)

        console.log(user);
        
        if(!user){
            return res.status(400).json({
                success : false , 
                message : 'user not found'
            })
        }

        //if old password is correct 

        const isPasswordMatch = await bcrypt.compare(oldPassword , user.password)

        if(!isPasswordMatch){
            return res.status(400).json({
                success : false ,
                message : 'old password is not correct. Please try again'
            })
        }

        const salt = await bcrypt.genSalt(10)
        const newhashedPassword = await bcrypt.hash(newPassword , salt)

        //update user password

        user.password = newhashedPassword;
        await user.save()

        res.status(200).json({
            success : true , 
            message : 'password changed successfully'
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Some error occured"
        })
    }
}

module.exports = { registerUser , loginUser ,changePassword}