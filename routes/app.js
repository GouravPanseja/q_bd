const express = require("express");
const router = express.Router();

// import controllers
const {changePassword,sendOtp,login,signup} = require("../controllers/Auth");
const {createForm, getAllForms, getForm, deleteForm} = require("../controllers/Form");
const {getAllTemplates} = require("../controllers/Template");
const {resetPasswordToken, resetPassword} = require("../controllers/ResetPassword")

//import middlewares
const {auth,isAdmin,isFormFiller} = require("../middlewares/auth");


// authorisation
router.post("/sendOtp",sendOtp);                            // verified
router.post("/signup",signup); 

router.get("/login", login);
router.post("/resetPasswordToken",resetPasswordToken);
router.post("/resetPassword", resetPassword);

// others
router.get("/getAllForms",auth, isAdmin,getAllForms);

router.get("/getAllTemplates",auth,isAdmin,getAllTemplates);

// TODO: getForm api pending
router.get("/createForm", auth,isAdmin,createForm);
router.delete("/deleteForm",auth,isAdmin, deleteForm);


module.exports = router;
