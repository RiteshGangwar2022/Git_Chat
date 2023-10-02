import * as React from "react";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import { Button, Divider } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import { Paper, Avatar, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Loading from "./Loading";

const SideDrawer = ({ state, setstate, toggleDrawer }) => {
  const [text, settext] = React.useState("");
  const [searchdata, setsearchdata] = React.useState([]);
  const [loading, setloading] = React.useState(false);
  const [loading1, setloading1] = React.useState(false);
  const { user, setSelectedChat, chats, setChats } = ChatState();

 

  const accesschat = async (userId) => {
    //console.log(userId);
    setsearchdata([]);
    try {
      setloading1(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      //console.log(config)

      const { data } = await axios.post(`/api/chat`, { userId }, config);
      // console.log(data);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setloading1(false);
      setSelectedChat(data);
      toggleDrawer(false)
      toast.success("chat created !", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handlesearch = async (e) => {
    setsearchdata([]);
    settext(e);
    if (!text) {
      toast.error("Please, Enter some Text 👎!", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      setloading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.get(`/api/user/allusers?search=${text}`, config);
      //console.log(res.data);
      setloading(false);
      setsearchdata(res.data);
      //console.log(searchdata);
    
    } catch (err) {
      console.log("err");
      toast.error("No user found 👎!", {
        position: "top-center",
        autoClose: 2000,
      });
      console.log(err);
    }
  };

  const input = {
    display: "flex",
    flexDirection: "row",
    padding: "5px",
    margin: "5px 3px",
    backgroundColor: "#80cbc4",
  };

  
  const sidebar = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    height: "89vh",
    width:"25vw",
    borderRadius: "5px",
    margin: "5px 1px",
    backgroundColor: "#B9F5D0",
  };

  const profile = {
    display: "flex",
    flexDirection: "row",
    width: "93%",
    height: "55px",
    borderRadius: "10px",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "3px 7px",
    padding: "5px",
    cursor: "pointer",
    border: "1px solid white",
    backgroundColor: "#80cbc4",
  };

  const avatar = {
    justifyContent: "flex-start",
    padding: "2px",
    position: "relative",
    right: "5px",
  };
  const name = {
    TextAlign: "center",
    marginRight: "1px",
    color: "#eeeeee",
  };
  const textin={

       width:"100%"
  };

  const list = (anchor) => (
    <Box>
      <Box
        sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      ></Box>
      <Box style={input}>
        <TextField
          id="filled-basic"
          label="Search User..."
          variant="filled"
          style={textin}
          onChange={(e) => handlesearch(e.target.value)}
        />
        <ToastContainer position="top-right" autoClose={2000} />
      </Box>
      <Divider />

      <Paper style={sidebar}>
        {loading&& <Loading/>
        }
        {searchdata?.map((user) => (
          <Paper
            key={user._id}
            style={profile}
            onClick={() => accesschat(user._id)}
          >
            <Box style={avatar}>
              <Avatar src={user.pic} sx={{ width: 52, height: 52 }} />
            </Box>
            <Box style={name}>
              <Typography variant="h5">{user.name}</Typography>
              <Typography variant="h6" color="black">
                <span style={{ fontWeight: "600", color: "black" }}>
                  Email:
                </span>
                {user.email}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Paper>
    </Box>
  );

  return (
    <div>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
};

export default SideDrawer;
