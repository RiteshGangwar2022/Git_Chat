const express = require("express");
const router = express.Router();


const {Getmessage,Sendmessage} = require("../controller/message");
const {protect}=require("../middleware/Authentication");



//we are putting middleware (protect) to authenticate users before getting allusers
router.get("/:chatId",protect,Getmessage);
router.post("/",protect,Sendmessage);

module.exports = router;
