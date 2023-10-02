import React, { useState, useEffect } from "react";
import { Paper, Avatar, Box, Typography, Divider } from "@mui/material";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import Modalgroup from "./Modalgroup";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { getSender, getSenderFull } from "../config/chatlogics";
import Loading from "./Loading";


const Sidebar = ({ fetchAgain }) => {
  const { user, setUser, setSelectedChat, selectedChat, chats, setChats } =
    ChatState();
  const [loading, setloading] = useState(false);

  const fetchChats = async () => {
    //console.log(user);
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      //console.log(config);
      const res = await axios.get("/api/chat", config);
      // console.log(res)
      setloading(false);
      setChats(res.data);
      /*console.log(res.data);
      console.log(chats);*/
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user]);

  const sidebar = {
    display: "flex",
    flexDirection: "column",
    height: "88vh",
    backgroundImage:"linear-gradient(-90deg, #B9F5D0, #80cbc4)",
    borderRadius: "5px",
    margin: "5px 5px",
    border: "4px solid #B9F5D0",
  };

  const profile = {
    display: "flex",
    flexDirection: "row",
    width: "95%",
    height: "58px",
    borderRadius: "8px",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "3px 5px",
    padding: "3px",
    cursor: "pointer",
    backgroundColor: "#80cbc4",
    border: "2px solid white",
  };
  const top = {
    display: "flex",
    flexDirection: "row",
    width: "98%",
    height: "70px",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "0px",
    marginBottom: "5px",
    padding: "4px",
    backgroundColor: "#4db6ac",
    border: "2px solid white",
  };
  const avatar = {
    padding: "3px",
    marginRight: "15px",
  };
  const btn = {
    border: "none",
    cursor: "pointer",
    marginTop: "2px",
    borderRadius: "10px",
  };



  return (
    <>
      <Paper style={sidebar}>
        <Paper  style={top}>
          <Typography variant="h4">My Chats</Typography>
          <Typography
            variant="h6"
            style={{ position: "relative", left: "70px" }}
          >
            Create Group
          </Typography>
          <Modalgroup>
            <button style={btn}>
              <AddCircleIcon />
            </button>
          </Modalgroup>
        </Paper>
        <Divider />
        {loading ? (
          <Loading />
        ) : (
          chats?.map((val) => {
            return (
              <div key={val._id} onClick={() => setSelectedChat(val)}>
                <Box style={profile}>
                  <Box style={avatar}>
                    <Avatar
                      src={
                        !val.isGroupChat
                          ? getSenderFull(user, val.users).pic
                          : ""
                      }
                      sx={{ width: 52, height: 52 }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="h6">
                      {" "}
                      {!val.isGroupChat
                        ? getSender(user, val.users)
                        : val.chatName}
                    </Typography>
                    {val.latestMessage && (
                      <Typography variant="h6">
                        <b>{val.latestMessage.sender.name} : </b>
                        {val.latestMessage.content.length > 50
                          ? val.latestMessage.content.substring(0, 51) + "..."
                          : val.latestMessage.content}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </div>
            );
          })
        )}
      </Paper>
    </>
  );
};

export default Sidebar;
