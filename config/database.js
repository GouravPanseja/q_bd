const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async()=> {

    try{
       await mongoose.connect(process.env.DB_URL,{});
       console.log("dB connection succful");
    }
    catch(err){
        console.log("db connection failed");
        console.error(err);
        process.exit(1);
    }
}

module.exports = dbConnect;