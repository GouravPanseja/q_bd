const Response = require("../models/Response");
const Form = require("../models/Form");

// create a response
exports.createResponse = async(req,res)=>{
    try{
        const {userDet} = req.user;
        const {formId,data,commentBody} = req.body;
        
        if(!userDet || !formId || !data){
            return res.status(401).json({
                success:false,
                message:"Please provide all data"
            })
        }
        if(commentBody){

            const createdComment = await Comment.create({
                createdBy:userDet.id,
                body:commentBody,
                form:formId,
            })
        }

        const createdResponse  = await Response.create({responseBy:userDet.id, formId, data});
        
        var updatedForm;
        if(!commentBody){
            updatedForm =  await Form.findByIdAndUpdate(formId, {$push:{responses:createdResponse._id}}, {new:true});
        }else{
            updatedForm = await From.findByIdAndUpdate(formId, {$push:{responses:createdResponse._id}, $push:{comments:createdResponse._id}}, {new:true});
        }
        
        console.log("updatedForm ",updatedForm);
        return res.status(200).json({
            success:true,
            message:"Response created succesfully",
            data:createdResponse,
        })
    }
    catch(err){
        console.log("error",err);
        res.status(400).json({
            success:false,
            data:err.message,
            message:"Something went wrong while creating response. Please try again"
        })
    }
}

// get all resposnes 
exports.getAllResponse = async(req,res)=>{
    try{
        const {formId} = req.body;

        if(!formId){
            return res.status(401).json({
                success:false,
                message:"FormId not provided"
            })
        }
        const responses = await Response.find({formId}).populate("responseBy").exec();

        return res.status(200).json({
            success:true,
            data:responses,
            message:"Responses fetched succesfully",
        })
    }
    catch(err){
        console.log("error" ,err);
        return res.status(400).json({
            success:false,
            message:"Something went wrong while fetching the responses"
        })
    }
}