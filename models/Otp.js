const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OtpSchema = mongoose.Schema({

    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true
    },
    timeStamp:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
    
})

// function t o send emails

async function sendVerificationEmail({email,otp}){
    try{

        const emailResponse = await mailSender(email, "Verification email from Qeurify", otp);
        console.log("Email sent succesfully");
        console.log("emailResponse",emailResponse);
    }       

    catch(err){
        console.log("error occured while sending mail");
        console.log("error" ,err.message);
        throw err;
    }
}
// pre-save middleware

OtpSchema.pre("save", async function(next){

    await sendVerificationEmail(this.email, this.otp);

    next();
} )
module.exports = mongoose.model("Otp",OtpSchema);