import React from "react";
import { Paper, Box, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ChatState } from "../../Context/ChatProvider";
import Singlechat from "./Singlechat";


const Chatting = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const main = {
    height: "88vh",
    backgroundColor: "#e3f2fd",
    borderRadius: "5px",
    margin: "5px 1px",
    border:"5px solid #B9F5D0"
  };

  const top = {
    backgroundColor: "white",
    height: "30px",
    borderRadius: "10px",
    border: "1px solid white",
    display: "flex",
    flexDirection: "row",
    alignItem: "center",
    justifyContent: "flex-end",
  };

  return (
    <>
      <Paper style={main}>
        <Singlechat />
      </Paper>
    </>
  );
};

export default Chatting;
