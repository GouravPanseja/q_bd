const mongoose = require("mongoose");

const FormSchema = mongoose.Schema({

    title:{ 
        type:String,
        required:true,
    },
    category:{
        type:String,
        enum:["governmentSurvey","healthcareSurvey","eventSurvey","feedbackSurvey","diversity","covid-19","others"]
    },
    logoUrl:{
        type:String,
        required:true,
    },
    formUrl:{
        type:String,
        required:true,
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    data:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Que",
        required:true,
    }],

    responses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Response",
    }],

    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
    }],

    createdAt:{
        type:Date,
        required:true,
        default:Date.now(),
    },

    startAt:{
        type:Date,
        required:true,
    },
    expiresAt:{
        type:Date,
        required:true,

    },
    visualData:{
        type:Object,
        required:true,
    },
    participantCount:{
        type:Number,
        required:true
    }


})

module.exports = mongoose.model("Form", FormSchema);