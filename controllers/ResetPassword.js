const { configDotenv } = require("dotenv");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt")

// will get the email from req and will create a unique token that woudl

exports.resetPasswordToken = async(req,res) =>{


    try{
        // get email from req body
        const email = req.body.email                            // only email will be sent 

        // Validation: check if email is registered 
        const isUserPresent = await User.findOne({email});

        if(!isUserPresent){

            return res.status(400).json({
                success:false,
                message:"User isn't registered"
            })
        }

        // generate token
        const token = crypto.randomUUID();

        // update user by adding token and expiration time 
        const updatedUser = User.findOneAndUpdate({email}, {token, resetPasswordEpires: Date.now() + 5 * 60 * 1000}, {new:true});
        
        // creat url    
        const url = `http://localhost:3000/update-password/${token}`

        // send mail containig url
        await mailSender(email, "Password Reset Link", `click on the link to reset your password ${url}`);

        // return res
        return res.status(200).json({
            success:true,
            data:updatedUser,
            message:"Email sent succesfully"
        })
    
    }
    catch(err){
        console.log("error",err);
        return res.status(500).json({
            success:false,
            message:"Something went wrong, while sending reset password email"
        })
    }
}   

// resetPassword in db
exports.resetPassword = async (req,res)=>{

    try{
        // data fetch
        const {password, confirmPassword,token } = req.body;


        // validation   
        if(confirmPassword !== password){
            return res.status(400).json({
                success:false,
                message:"Password not matched"
            })
        }

        // get user details fro db using token

        const userDet = await User.findOne({token});


        // if no entry - invalid token
        if(!userDet){
            return res.status(403).json({
                success:false,
                message:"Token is not correct"
            })
        }
        // time expiration checking 
        if( userDet.resetPasswordExpires < Date.now()){
            return res.status(400).json({
                success:false,
                message:"Token in expired, please try again"
            })
        }

        // hash password 
        
        const hashedPassword = await bcrypt.hash(password,10);

        // updat password in User doc

        const updatedUser =  await User.findOneAndUpdate({token}, {password:hashedPassword}, {new:true});

        // return response
        return res.status(200).json({
            success:true,
            message:"Password reset succesfully",
            data:updatedUser,
        })
    }
    catch(err){
        return res.status(500).json({
            success:true,
            message:"Something went wrong while password reset"
        })
    }
}