const Template = require("../models/Template");

exports.getAllTemplates = async (req,res)=>{

    try{    
        const templates = await Template.find();

        return res.status(200).json({
            success:true,
            message:"succesfully fetched templates",
            data:templates
        })
    }
    catch(err){
        console.log("error",err);
        return res.status(400).json({
            success:false,
            data:err.message,
            message:"something went wrong while fetching templates"
        })
    }
}