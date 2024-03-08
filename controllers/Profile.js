const Profile = require("../models/Profile");
const User = require("../models/User");
const imageUploader = require("../utils/imageUploader");


exports.upateProfile = async(req,res)=>{
    try{
        const { 
            age,
            gender,
            qualification,
            companyName,
            jobTitle,
            contact,
            city,
            country,
            dateOfBirth,
        } = req.body;

        const image = req.files.image;
        
        const imageUploaded_url = null;
        if(image){ 
            const imageUploaded = await imageUploader(image,process.env.PROFILE_FOLDER);
            imageUploaded_url = imageUploaded.secure_url;
        }

        const {userDet}  = req.user;

        // we will not do validation for availabilty of all values as user can update whatever he wants

        const updatedProfile = await Profile.findOneAndUpdate({user:userDet.id}, {
            age,
            gender,
            image:imageUploaded_url,
            qualification,
            companyName,
            jobTitle,
            contact, 
            city,
            country,
            dateOfBirth
        }, {new:true});
        
        return res.status(200).json({
            success:true,   
            message:"Profile updated successfully",
            data:updatedProfile,
        })
    }
    catch(err){
        console.log("errorr",err);
        return res.status(400).json({
            success:false,
            message:"Profile updation unsuccesful",
        })
    }
}