const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();


// authorisation by verification of jwt token
exports.auth = async (req,res,next)=>{

    try{
        // extract token
        const {token} = req.body.token 
                        || req.cookies.token
                        || req.header("Authorisation").replace("Bearer ", "");


        // if token could'nt be obtained from any of the three sources-> return error
        if(!token){
            return res.status(401).json({
                success:false,
                message:"token not found"
            })
        }

        // verify the token

        try{                                                                    // wierd internal implimentation of jwt.verify even though being async and returnign promise still dosn't uses await
            const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
            console.log("decodedPayload" ,decodedPayload);
            req.user = decodedPayload;
        }
        catch(err){
            return res.status(401).json({
                success:false,
                message:"token is invalid",

            })
        }

        next();
    }   
    catch(err){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while authorisation with token"
        })
    }
}

// isStudent ---> check if the role is studend of the client
exports.isFormFiller = async(req,res,next) =>{
    try{
    
        if(req.user.role !== 'formFiller'){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for newUsers only"
            })
        }
        
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again"
        })
    }
}

// isAdmin --> check if the role is admin of the client
exports.isAdmin = async(req,res,next) =>{
    try{
    
        if(req.user.role !== 'admin'){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin only"
            })
        }
        
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again"
        })
    }
}