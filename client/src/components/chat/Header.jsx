import React, { useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import Avatar from "@mui/material/Avatar";
import SideDrawer from "./SideDrawer";
import {
  Grid,
  Paper,
  Box,
  Typography,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import "../../App.css"
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Header = () => {
  const { user } = ChatState();

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  /*drawer functions */

  const [state, setState] = useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const header = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "60px",
    width: "99vw",
    backgroundColor: "#4db6ac",
    border:"2px solid #B9F5D0",
    borderRadius:"10px"
  };

  const searchbar = {
    alignItems: "center",
    margin: "0px 12px",
    cursor: "pointer",
    position:"relative",  
   
   
  };

  const searchicon = {
    height: "30px",
    width: "30px",
    position: "relative",
    top: "10px",
    left: "2px",
  };

  const head = {
    padding: "5px",
    color: "black",
  };

  const btn = {
    height: "35px",
    width: "130px",
    border: "none",
    cursor: "pointer",
    marginBottom: "10px",
    backgroundColor: "#B9F5D0",
    fontSize: "17px",
    fontWeight: "600",
    borderRadius:"10px",
    border:"2px solid white"
  };

  const rightdiv = {
    display: "flex",
    flexDirection: "row",
  };

  const avatarcontainer = {
    display: "flex",
    flexDirection: "row",
    margin: "6px 10px",
    padding: "4px",
    alignItems: "center",
    justifyContent:"center",
    cursor: "pointer",
    backgroundColor: "#B9F5D0",
    width: "110px",
    height: "33px",
    borderRadius: "10px",
    position:"relative",
    top:"4px",
    border:"1px solid white"
  };

  const logoutbtn = {
    height: "27px",
    width: "90px",
    margin: "1px 5px",
    cursor: "pointer",
    border:"1px solid white",
    backgroundColor:"teal",
    color:"white"

  };

  const notificationcontainer = {
    padding: "5px",
    height: "50px",
    width: "50px",
  };

  return (
    <>
      <Grid item md={12} sm={12} xs={12}>
        {user && (
          <SideDrawer
            state={state}
            setState={setState}
            toggleDrawer={toggleDrawer}
          />
        )}
        {user ? (
          <>
            <Paper style={header} >
              <Box style={searchbar} className="lefthead">
                <Tooltip title="search user...">
                  <SearchIcon style={searchicon} className="icon" />
                  <button style={btn} onClick={toggleDrawer("left", true)}>
                    Search User...
                  </button>
                </Tooltip>
              </Box>
              <Box style={head}>
                <Typography variant="h4" color="white">Git_Chat</Typography>
              </Box>
              <Box style={rightdiv}>
                <div style={notificationcontainer}>
                  <IconButton size="large" color="inherit">
                    <NotificationsIcon />
                  </IconButton>
                </div>
                <Box style={avatarcontainer}>
                  <Tooltip title="Profile">
                    <Avatar src={user.pic} />
                  </Tooltip>
                  <Tooltip title="Logout">
                    <Button
                      type="submit"
                      color="primary"
                      variant="filled"
                      style={logoutbtn}
                      fullWidth
                      onClick={logout}
                    >
                      Logout
                    </Button>
                  </Tooltip>
                </Box>
              </Box>
            </Paper>
          </>
        ) : (
          ""
        )}
      </Grid>
    </>
  );
};

export default Header;
