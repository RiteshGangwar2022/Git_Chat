import { React, useState } from "react";
import Imagecompo from "./Imagecompo";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { ChatState } from "../../Context/ChatProvider";

const Signup = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [Image, setImage] = useState("");

  const { setUser } = ChatState();

  const navigate = useNavigate();
  //form submit
  const senddata = async (e) => {
    e.preventDefault(); //to prevent default behaviour of form ,so that it don't refresh page

    if (name === "" || email === "" || password === "") {
      toast.error("Fill all the data properly 👎!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      const res = await axios.post("/api/user/register", {
        name,
        email,
        password,
        Image,
      });
      //console.log(res);
      setUser(res.data);
      // console.log(res.data)
      navigate("/chat");
      if (res.status === 201) {
        toast.success("User Registered!", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  //to convert image to binary form and save it into state
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    /*console.log(base64)
    console.log(String(base64))*/
    setImage(String(base64));
    //console.log(Image)
  };

  //styling of page
  const paperStyle = {
    padding: 8,
    height: "100vh",
    width: "90%",
  };
  const avatarStyle = { backgroundColor: "#1e88e5" };
  const btnstyle = { margin: "10px 5px", height: "45px", width: "100%" };
  const textinp = {
    margin: "10px",
    width: "98%",
  };

  return (
    <>
      <div className="main">
        <div className="imagecontainer">
          <Imagecompo />
        </div>
        <div className="form">
          <form method="POST">
            <Grid >
              <Paper elevation={2}  style={paperStyle} >
                <Grid align="center">
                  <Avatar style={avatarStyle}></Avatar>
                  <h2>Sign Up</h2>
                </Grid>
                <Divider />
                <TextField
                  placeholder="Enter username"
                  fullWidth
                  required
                  style={textinp}
                  value={name}
                  autoComplete=""
                  onChange={(e) => setname(e.target.value)}
                />
                <Divider />
                <TextField
                  placeholder="Enter Email"
                  fullWidth
                  required
                  style={textinp}
                  value={email}
                  autoComplete=""
                  onChange={(e) => setemail(e.target.value)}
                />
                <Divider />
                <TextField
                  placeholder="Enter password"
                  type="password"
                  fullWidth
                  required
                  style={textinp}
                  value={password}
                  autoComplete=""
                  onChange={(e) => setpassword(e.target.value)}
                />
                <Divider />
                <TextField
                  type="file"
                  fullWidth
                  required
                  style={textinp}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e)}
                />
                <Divider />

                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  style={btnstyle}
                  fullWidth
                  onClick={senddata}
                >
                  Register
                </Button>
                <Divider />
                <Typography variant="h6" textAlign="center">
                  Do you have an account ?
                </Typography>
                <Link to="/">
                  <Button
                    type="submit"
                    color="error"
                    variant="contained"
                    style={btnstyle}
                    fullWidth
                  >
                    Sign In
                  </Button>
                </Link>
              </Paper>
            </Grid>
          </form>
        </div>
        <ToastContainer position="bottom-right" autoClose={2000} />
      </div>
    </>
  );
};

export default Signup;

//function to convert image into base64 or binary format

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
