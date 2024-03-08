const mongoose = require("mongoose");

const ProfileSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    image:{
        type:String,
    },
    age:{
        type:String,
        trim:true
    },
    gender:{
        type:String,
        trim:true,
        enum:["male","female","notSay"]
    },
    qualification:{
        type:String,
        enum:["HighSchool","Graduation","PostGraduation"]
    },
    companyName:{
        type:String,
        trim:true
    },
    jobTitle:{
        type:String,
        trim:true,
    },
    contact:{
        type:Number,
        trim:true,
    },
    city:{
        type:String,
        trim:true,

    },
    country:{
        type:String,
        trim:true,

    },
    dateOfBirth:{
        type:String,
        trim:true,
    }
})

module.exports = mongoose.model("Profile", ProfileSchema);