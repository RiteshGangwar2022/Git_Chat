const express=require("express");
const mongoose=require("mongoose");
const app=express();
const dotenv=require("dotenv");
const cors=require("cors");
const userRoutes=require("./routes/user");
const chatRoutes=require("./routes/chat");
const messageRoutes=require("./routes/message")
const path=require("path");
const {notFound,errorHandler}=require("./middleware/errorMiddleware");
//we need to include env file only in serverjs 
dotenv.config();
//to connect backend to database
const connectdb=require("./Database/DBconnection");
connectdb();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
app.use(cors());


//for deployment
app.use(express.static(path.join(__dirname, "./client/build")))
app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname, "./client/build/index.html"))
})


// User routes
app.use("/api/user", userRoutes);

//chat routes
app.use("/api/chat", chatRoutes);

//message routes
app.use("/api/message",messageRoutes);


//to hanlde error cause to due to hitting of api which does not exist
app.use(notFound);
app.use(errorHandler);

const port=process.env.PORT;

const server=app.listen(port,(()=>{
    console.log(`server is running on port ${port}`);
}));

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
      // credentials: true,
    },
  });
  
  io.on("connection", (socket) => {
    //console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
     // console.log("User Joined Room: " + room);
    });
  
  
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
    // console.log(newMessageRecieved)
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });
  
    socket.off("setup", () => {
     // console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });