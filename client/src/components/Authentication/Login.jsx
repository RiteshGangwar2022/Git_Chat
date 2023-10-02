import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Imgagecompo from "./Imagecompo";
import "./Auth.css";
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

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  const {setUser}=ChatState();

  //form submit
  const senddata = async (e) => {
    e.preventDefault(); //to prevent default behaviour of form ,so that it don't refresh page

    if (email === "" || password === "") {
      toast.error("Fill all the data properly 👎!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      const res = await axios.post("/api/user/login", {
        email,
        password,
      });
      // console.log(res);
      setUser(res.data);
      // console.log(res.data)
      navigate("/chat");

      if (res.status === 201) {
        toast.success("User Login Successfully  😃!", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  //styling of page
  const paperStyle = {
    padding: 8,
    height: "100vh",
    width: "90%",
  };
  const avatarStyle = { backgroundColor: "#1e88e5" };
  const btnstyle = { margin: "10px 5px", height: "45px", borderRadius: "5px" };
  const textinp = {
    margin: "8px",
    width: "98%",
    borderRadius: "5px",
  };
  return (
    <>
      <div className="main">
        <div className="imagecontainer">
          <Imgagecompo />
        </div>
        <div className="form">
          <form method="Post">
            <Grid>
              <Paper elevation={1} style={paperStyle}>
                <Grid align="center">
                  <Avatar style={avatarStyle}></Avatar>
                  <h2>Sign In</h2>
                </Grid>
                <Divider />
                <TextField
                  placeholder="Enter username"
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
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  style={btnstyle}
                  fullWidth
                  onClick={senddata}
                >
                  Sign in
                </Button>
                <Divider />
                <Typography variant="h6" textAlign="center">
                  Don't you have an account ?
                </Typography>
                <Link to="/signup">
                  <Button
                    type="submit"
                    color="error"
                    variant="contained"
                    style={btnstyle}
                    fullWidth
                  >
                    Sign Up
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

export default Login;
