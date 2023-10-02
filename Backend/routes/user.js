const express = require("express");
const router = express.Router();


const {Login,Signup,AllUsers} = require("../controller/user");
const {protect}=require("../middleware/Authentication");

router.post("/login", Login);
router.post("/register", Signup);

//we are putting middleware (protect) to authenticate users before getting allusers
router.get("/allusers",protect,AllUsers);


module.exports = router;
