const User = require("../models/User");
const Otp = require("../models/Otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const mailSender = require("../utils/mailSender");

// send OTP function
exports.sendOtp = async(req,res)=>{

    try{
        // fetch required data
        const {email} = req.body            // fetch email from body
        console.log(req.body);
        // validation
        if(!email){
            console.log("email not there in the body")
            return res.status(400).json({
                success:false,
                message:"email is required"
            })
        }
        // check if user is already registered
        const isUserPresent = await User.findOne({email});

        console.log("isUserPresent" ,isUserPresent);
        if(isUserPresent){
            return res.status(400).json({
                success:false,
                message:"email already in use"
            })
        }

        // generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        console.log("otp generated " + otp);

        var isOtpPresent = await Otp.findOne({otp});       // check if any doc already has same OTP

        while(isOtpPresent){                              // in loop create new OTPs untill we find one that isn't already present

            otp = otpGenerator.generate(6,{

                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false

            })

            isOtpPresent = await Otp.find({otp});               // check if the currently generated otp is already present in the db
        }
        
        
        const createdOtpDoc = await  Otp.create({email,otp});  // create entry in db 

        res.status(200).json({
            success:true,
            message:"Otp sent succesfully",
            data:createdOtpDoc,
        })

    }
    catch(err){
        console.log("error" ,err);
        console.log("Something went wrong! Can't send Otp")

        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}

//signup
exports.signup = async(req,res)=>{
    try{

        // data fetch from body
        const {
            name,
            email,
            password,
            confirmPassword,
            otp,

        }  = req.body;


        // validation

        if(!name || !email || !password || !confirmPassword || !otp){        // role will absolutly will be there because we have switch button in the Front end for this
            return res.status(403).json({
                success:false,
                message:"All fields are not filled"
            })
        }

        // compare confirm pass and pass
        
        if(confirmPassword != password){
            return res.status(400).json({
                success:false,
                message:"Password and Confirm password doens't match"
            })
        }

        // check if user already exists
        const isUserPresent = await User.findOne({email}); 

        if(isUserPresent){
            console.log(req.body);
            console.log(isUserPresent);
            return res.status(400).json({
                status:false,
                message:"email already in use"
            })
        }
        // get most recent otp from db
        
        var recentOtp = await Otp.find({email}).sort({createdAt:-1}).limit(1);    // sort in descending order on the basis of createdAt field's value and extract the first one from it .. giving the most recent otpObj

        console.log("recentOtp ",recentOtp);


        // check if there is any otp found... here, recentOtp should is an array of length 1;
        if(recentOtp.length == 0){  
            return res.status(400).json({
                success:false,
                message:"OTP wasn't created"
            })
        }

        // compare the actual otp with given otp
        // if(recentOtp.otp !== otp){
        //     return res.satus(400).json({
        //         success:false,
        //         message:"Otp doesn't match"
        //     })
        // }

        // hash the pass
        const hashedPass = await bcrypt.hash(password,10);

        const profile  = await  Profile.create({     // create an empty profile doc because we have to put its uid in the User's doc
            user:null,
            age:null,
            gender:null,
            qualification:null,
            companyName:null,
            jobTitle:null,
            contact:null,
            city:null,
            country:null,
            dateOfBirth: null,
        });  

        const createdUser = await User.create({
            name,
            email,
            password:hashedPass,
            profile:profile._id,
            accountType : "admin",
            additionalDetials:profile._id,
            image: `https:api.dicebear.com/5.x/initials/svg?seed=${name}`
        });
        
        // update the profile with the userId
        const updatedProfile = await Profile.findByIdAndUpdate(profile._id, {user:createdUser._id}, {new:true});
        
        // return res
        res.status(200).json({
            success:true,
            message:"User is registered",
            data:createdUser,
        })
    }

    catch(err){
        console.log("error",err);
        
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

// login 
exports.login = async(req,res)=>{
    try{
        // extract data from req body
        const {email, password} = req.body;

        // validation of data 
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"please enter all details"
            })
        }

        // check if user is registered
        const userDet = await User.findOne({email});

        if(!userDet){
            return res.json(401).json({
                success:false,
                message:"User is not registerd. Please signup",
            })
        }
        // compare the pass
        const isPassMatched = await bcrypt.compare(password, userDet.password);

        // generate jwt token 
        
        if(isPassMatched){

            const payload = {
                email: userDet.email,
                id:userDet._id,
                role:userDet.accountType,
            }
            
            const token = jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            
            // modify the userObj before sending to the client
            userDet.token = token;
            userDet.password = undefined;

            // options for cookie
            const options ={
                expires: new Date(Date.now() + 3 * (24 * 60 * 60)),     // here we need to give the date in propper format and not in milliseconds, Date.now() give current time in millis and the new Date(time in millis) returns date in proper format
                httpOnly:true,
            }

            // create cookie and send response
            res.cookie("token",token, options).status(200).json({
                success:true,
                token,
                userDet,
                message:"logged in successfully",
            })
        }
        
        else{
            return res.status(400).json({
                success:false,
                message:"password doesn't match",
            })
        }
      
    }
    catch(err){
        console.log("error",err);

        return res.status(500).json({
            success:false,
            message:"Login failiure. Please try again"
        })
    }
}

// change the password ---> prev pass is known but just want to change
exports.changePassword = async (req,res)=>{
    try{
        const {email,oldPassword, newPassword, confirmNewPassword} = req.body;

        const user = await User.findOne({email});

        if(oldPassword != user.password){
            return res.status(400).json({
                success:false,
                message:"Old password isn't valid",
            })
        }

        if(newPassword != confirmNewPassword){
            return res.status(400).json({
                success:false,
                message:"Password and Confirm password doesn't match",
            })   
        }

        const updatedUser = await User.findOneAndUpdate(user.email ,{password:newPassword},{new:true} );

        res.status(200).json({
            success:true,
            message:"Password changed succesfully",
            data:updatedUser,
        })

    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            success:false,
            message:""
        })
    }
}
