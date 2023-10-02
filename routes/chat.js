const express = require("express");
const router = express.Router();


const {AccessChat,fetchChats,createGroupChat,removeGroup,renameGroup,addGroup}=require("../controller/chat");
const {protect}=require("../middleware/Authentication");

//we are putting middleware (protect) to authenticate users before making call to follwing apis

//end point=>/api/chat
router.post("/",protect,AccessChat);
router.get("/",protect,fetchChats);

//end point=>api/chat/group
router.post("/group",protect,createGroupChat);

//end point=>api/chat/rename
router.post("/rename",protect,renameGroup);

//end point=>api/chat/remove
router.post("/remove",protect,removeGroup);

//end point=>api/chat/addgroup
router.post("/addgroup",protect,addGroup);


module.exports = router;
