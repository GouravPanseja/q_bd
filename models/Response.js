const mongoose = require("mongoose");

const ResponseSchema = mongoose.Schema({

    responseBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    formId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Form",
        required:true,
    },
    data:{
        type:Object,
        required:true,
    }
})

module.exports = mongoose.model("Response", ResponseSchema);