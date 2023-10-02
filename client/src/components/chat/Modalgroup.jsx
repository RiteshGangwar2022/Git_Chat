import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "./UserBadgeItem";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const textinp = {
  margin: "8px",
  width: "98%",
  borderRadius: "5px",
};

const profile = {
  display: "flex",
  flexDirection: "row",
  width: "90%",
  height: "50px",
  borderRadius: "10px",
  justifyContent: "center",
  alignItems: "center",
  margin: "3px 7px",
  padding: "2px",
  cursor: "pointer",
  border: "1px solid white",
  backgroundColor: "#eeeeee",
};

const avatar = {
  padding: "1px",
  alignItems: "flex-start",
};
const name = {
  TextAlign: "center",
  marginRight: "1px",
};

const list = {
  Overflow: "scroll-y",
};
const userlist = {
  Display: "flex",
  flexDirection: "row",
  height: "52px",
  Width: "98%",
  border: "1px solid black",
  borderRadius: "8px",
  alignItems:"center",
  justifyContent:"center"
};


const btnstyle = { margin: "10px 5px", height: "45px", width: "100%" };

export default function KeepMountedModal({ children }) {
  const [open, setOpen] = React.useState(false);
  const [groupName, setgroupName] = React.useState("");
  const [selectedUsers, setselectedUsers] = React.useState([]);
  const [search, setsearch] = React.useState("");
  const [searchResult, setsearchResult] = React.useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { user, chats, setChats } = ChatState();

  /*all function to create and handle user search*/

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    
    setselectedUsers([...selectedUsers, userToAdd]);
    console.log(selectedUsers);
  };

  const handlesearch = async (query) => {
    if (query === "") {
      setsearchResult([]);
    }
    setsearch(query);
    if (!query) {
      return;
    }
    //console.log(query);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/user/allusers?search=${search}`,
        config
      );
      //console.log(data);

      setsearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleDelete = (delUser) => {
    setselectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    //console.log("enter")
    if (!groupName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      //console.log(data);
      setOpen(false);
      setChats([data, ...chats]);
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.log(error)
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <div>
      <span onClick={handleOpen}>{children}</span>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Paper>
            <Typography
              variant="h4"
              style={{ textAlign: "center", position: "relative", top: "-7px" }}
            >
              Create Group Chat
            </Typography>
            <Divider />
            <Box>
              <TextField
                placeholder="Enter GroupName"
                fullWidth
                required
                style={textinp}
                value={groupName}
                onChange={(e) => setgroupName(e.target.value)}
              />
              <Divider />
              <TextField
                placeholder="Search User..."
                fullWidth
                required
                value={search}
                style={textinp}
                onChange={(e) => handlesearch(e.target.value)}
              />
            </Box>
          </Paper>
          <Box style={userlist}>
            {selectedUsers?.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </Box>
          <Divider />
          <Paper style={list}>
            {searchResult?.map((user) => (
              <Paper
                key={user._id}
                style={profile}
                onClick={() => handleGroup(user)}
              >
                <Box style={avatar}>
                  <Avatar src={user.pic} sx={{ width: 52, height: 52 }} />
                </Box>
                <Box style={name}>
                  <Typography variant="h5">{user.name}</Typography>
                  <Typography variant="h6">
                    <span style={{ fontWeight: "600" }}>Email:</span>
                    {user.email}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Paper>
          <Divider />
          <Box>
            <Button
              type="submit"
              color="error"
              variant="contained"
              style={btnstyle}
              fullWidth
              onClick={handleSubmit}
            >
              Create Group
            </Button>
          </Box>
        </Box>
      </Modal>
      <ToastContainer />
    </div>
  );
}
