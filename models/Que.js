const mongoose = require("mongoose");

const QueSchema = mongoose.Schema({

    type:{
        type:String,
        required:true,
    },
    statement:{
        type:String,
        required:true,
    },
    options:[{
        type:String,
    }],
    form:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Form"
    }
})

module.exports = mongoose.model("Que", QueSchema);