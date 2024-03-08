const Form  = require("../models/Form");
const User  = require("../models/User");
const Que  = require("../models/Que");
const Comment  = require("../models/Comment");
const Response  = require("../models/Response");
const imageUploader = require("../utils/imageUploader");

// create a form

exports.createForm = async(req,res)=>{

    try{
        // fetch data from req

        const{title, formUrl, quesData,createdBy, expireAt, startAt, participantCount, visualData} = req.body;

        const {userDet} = req.user;

        const logo = req.files.logo;

        // validation   
        if(!title || !formUrl ||  !quesData || !expireAt || !startAt || !participantCount || !visualData || !userDet || !logo){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields",
            })
        }

        // upload logo to cloudinary
        const uploadedLogo = await imageUploader(logo,process.env.LOGO_FOLDER);


        //insert Ids of Ques created in the Form
        const quesDocs  = await Que.insertMany(quesData);

        const quesIds = quesDocs.map((que) => que._id);

        // create Form entry 
        const formCreated = await Form.create({title, logoUrl:uploadedLogo.secure_url, formUrl, admin:userDet.id, data:quesIds, expireAt, startAt, participantCount, visualData})

        
        // update the admin User's doc in its collection
        const updatedUser = await User.findByIdAndUpdate(admin.id, {$push:{forms:formCreated._id}}, {new:true});

        // send resposne
        res.status(200).json({
            success:true,
            message:"Form createed succesfully",
            data1:formCreated,
            data2:updatedUser
        })
        
    }
    catch(err){
        console.log("error",err);

        return res.status(400).json({
            success:false,
            message:"Couldn't create the Form",
            data:err.message,
        })
    }
}

// get all forms for the user
exports.getAllForms = async(req,res)=>{
    try{
        // fetch data
        const {userDet} = req.user;           // will be put by auth middleware


        // validation
        if(!userDet){
            return res.status(400).json({
                success:false,
                message:"User detials not present"
            })
        }

        // get all forms created by this user from the db
        const forms = await Form.find({admin:userDet.id})
        .populate("admin")
        .populate("data")
        .populate("responses")
        .populate("comments");
        
        return res.status(200).json({
            success:true,
            message:"Forms fetched succesfully",
            data:forms,
        })

    }
    catch(err){
        console.log("error",err);

        return res.status(400).json({
            success:false,
            message:"Something went wrong while fetching the forms",
            data:err.message,
        })
    }
}

// getForm api pending


// delete form
exports.deleteForm = async (req,res)=>{
    var deletedDocs =[];            // to keep track of what docs are successfully deleted
    try{
        const {formId} = req.body;
        const {userDet} = req.user;

        //validation
        if(!formId){
            return res.status(400).json({
                success:false,
                message:"formId not provided"
            })
        }

        
        // delete Que docs of the form
        const deltedQues = await Que.deleteMany({form:formId})
        deletedDocs.push("ques");

        // delete Responses of the form
        const deltedResponses= await Response.deleteMany({form:formId})
        deletedDocs.push("responses");

        // delete Comments of the form
        const deltedComments = await Comment.deleteMany({form:formId})
        deletedDocs.push("comments");

        // update the Admin of the form
        const upatedUser = await User.findByIdAndUpdate(userDet.id, {$pull:{forms:formId}})
        deletedDocs.push("user");

        // delete the form
        const deletedForm = await Form.findByIdAndDelete(formId);
        deletedDocs.push("form");

        return res.status(200).json({
            success:true,
            message:"Form deleted succesfully"
        })

    }
    catch(err){
        console.log("error",err);
        return res.status(400).json({
            success:false,
            message:"Something went wrong while deleting the form",
            data:deletedDocs,
        })
    }
}