// imports
const express = require("express");
const fileUpload = require("express-fileupload");
const dbConnect = require("./config/database");
const cloudinaryConnect = require("./config/cloudinary");
const router = require("./routes/app");

require("dotenv").config();
const app = express();

var cors = require("cors");

const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "*",
  })
);


// mount middlewares
app.use(express.json());

app.use(fileUpload({
    useTempFiles:true,
}));

app.use("/api/v1", router);

// connecting to database
dbConnect();

// connection to cloundinary
cloudinaryConnect();

// activate server
app.listen(PORT , ()=>{
    console.log(`app is running at port ${PORT}`);
})

// dummy home page link
app.get("/",(req,res)=>{
    res.send("<h1> Home Page</h1>");
})

