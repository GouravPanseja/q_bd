const mongoose = require("mongoose");

const TemplateSchema = mongoose.Schema({

    title:{
        type:String,
        required:true,
        trim:true,
    },

    category:{
        type:String,
        required:true,
        trim:true,
        enum:["governmentSurvey","healthcareSurvey","eventSurvey","feedbackSurvey","diversity","covid-19","others"]
    },
    data:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Que",
    }],
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    },
    thumbnail:{
        type:String,
        required:true,
    }
})

module.exports = mongoose.model("Template", TemplateSchema);