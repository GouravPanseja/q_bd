const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
   createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },    
    body:{
        type:String,
        required:true,
    },
 
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    },
    form:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Form",
        required:true,
    }
})

module.exports = mongoose.model("Comment", CommentSchema);