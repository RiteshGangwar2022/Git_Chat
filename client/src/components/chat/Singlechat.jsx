import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Scrollchat from "./Scrollchat.jsx";
import { ChatState } from "../../Context/ChatProvider.jsx";
import io from "socket.io-client";
import { TextField, Typography, Box, FormControl } from "@mui/material";
import Loading from "./Loading.jsx";
const ENDPOINT = "http://localhost:5000"; //-> After deployment replace it with port=5000
var socket, selectedChatCompare;

const Singlechat = () => {
  const [messages, setmessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [newmessage, setnewmessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const { selectedChat, setSelectedChat, user } = ChatState();

  const bottom = {
    display: "flex",
    flexDirection: "row",
    alignItem: "center",
    justifyContent: "center",
    marginBottom: "10px",
    position: "fixed",
    bottom: 0,
    border: "2px solid white",
  };

  const input = {
    width: "65vw",
  };
  const chat={

     height:"78vh",
     overflow:"y",
     paddingBottom:"10px",
     backgroundImage:"linear-gradient(-90deg, #e0f7fa, #b2dfdb)",
     
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // console.log(selectedChat);
      // console.log(selectedChat._id);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setloading(false);
      setmessages(data);
      
      socket.emit("join chat", selectedChat._id);
      //console.log(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newmessage) {
      try {
        
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        //  console.log(selectedChat);
        setnewmessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newmessage,
            chatId: selectedChat,
          },
          config
        );
        //console.log(data);
        setmessages([...messages, data]);
        socket.emit("new message", data);
        //console.log(messages);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));  
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
     
        setmessages([...messages, newMessageRecieved]);
      
    });
  });



  return (
    <>
      {selectedChat ? (
        <>
          <Box style={chat}>
            {loading ? <Loading /> : <Scrollchat messages={messages} />}
          </Box>
          <Box style={bottom}>
            <FormControl onKeyDown={sendMessage} id="first-name" isRequired>
              <TextField
                id="filled-basic"
                label="Write message..."
                variant="filled"
                value={newmessage}
                onChange={(e) => setnewmessage(e.target.value)}
                style={input}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <>
          <Typography
            variant="h4"
            style={{ fontwidth: "600", margin: "200px 300px" }}
          >
            Select a Chat to start
          </Typography>
        </>
      )}
      <ToastContainer />
    </>
  );
};

export default Singlechat;
