const mongoose = require("mongoose");
const User = require("../Database/Models/Userschema");
const Chat = require("../Database/Models/Chatschema");

//use of populate in mongoose
/*
  => 1)when we create a schema in which we use another nested schema by using its reference, as we have (user and latest message)  in our chat schema. 
  => 2)so, if we send our chat in response on hitting api , then only we will have data of chatSchema and _id of reference (user and latestmessage) attributes
  => 3) but , if we also want to send data of reference schema (attributes) like user and latesetmessage, then, we have to use populate  of mongoose
  =>syntax =>  .populate("schemaname"); =>it will send data of reference schema
*/

//to access chat on clicking to user
const AccessChat = async (req, res) => {
  //getting user id from frontend on clicking to user
  const  {userId}  = req.body;
  //console.log(userId)

  if (!userId) {
    //console.log("UserId param not sent with request");
    return res.status(400).json({message:"no id found"});
  }

  //finding chats which are not groupchat and , contains both , login user id and , userId(reciever)
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage"); //getting data of userschema and latestmessage used as referece attributes in chatschema

  //nested populate
  //here, we want to populate sender of the latestmessage
  //so, first we are populating latestmessge, and , then , we are populating user(sender) of latestmessage
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    //if chat exist between these two users, then return chat
    res.send(isChat[0]);
  } else {
    //otherwise, create chat between current two users
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);

      //after creation, populate , user referecene attribute in chatschema without password
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      //finally, return chat
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

//to fetch chats
const fetchChats = async (req, res) => {
  //console.log("chats")
 
  try {
    //getting all chats whose id matches with userid
    //populating all the referece attributes of chatschema
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage") //it will give us data of messageschema
      .sort({ updatedAt: -1 }) //sorting from latest to older message
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        }); //here, we want to populate sender of the latestmessage
        //so, first we are populating latestmessge, and , then , we are populating user(sender) of latestmessage
      
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

//to create groupchat
const createGroupChat = async (req, res) => {
  //groupchat will have array of users containg their ids and , name of group chat,
  //users array contains the user id those going to be part of group chat
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  //converting users array into string
  var users = JSON.parse(req.body.users);

  //a group chat contains more than two users
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  //here, admin or current user will be added to users array
  users.push(req.user);

  try {
    //create a chat with isgroupchat=true,
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user, //current user will be admin of group
    });

    //get the chat of current groupchat form, and populate their reference attributes
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    //return groupchat details
    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

//rename groupchat
const renameGroup = async (req, res) => {
  //chatid and chatname from frontend response
  const { chatId, chatName } = req.body;
  console.log(req.body);

  //findbyidAndUpdate=> it used to first find the chat with given id, and if chat exist, then update its details
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName, //updating only name
    },
    {
      new: true, //mark=true, so that, it return new groupname, otherwise it wil return old name
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password"); //populate reference attributes data

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
};

//add memeber to group
const addGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId }, //using addToSet operator instead of push operator, so, that a user added once only in a group
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).json(added);

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
};

//remove member from group
const removeGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin
  if(userId==req.user._id){
    res.status(404).json({message:"Can not remove admin"});
    return;
  }

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId }, //pull operator is used to remove user from user array
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
};


module.exports = {
  AccessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addGroup,
  removeGroup,
};
