const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    profile:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
        required:true,
    },

    accountType:{
        type:String,
        enum:["admin","formFiller"],
        required:true,
    },
    forms:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Form"
    }]

})

module.exports = mongoose.model("User", UserSchema);