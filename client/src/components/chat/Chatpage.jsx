import React, { useContext, useEffect, useState } from "react";
import Header from "./Header";
import Chatting from "./Chatting";
import Sidebar from "./Sidebar";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    // console.log(user);

    if (user) {
      navigate("/chat");
    }
  }, [navigate]);

  return (
    <>
      <Grid container>
        <Header />
      </Grid>
      <Grid container>
        <Grid item md={4} sm={5} xs={5}>
          <Sidebar fetchAgain={fetchAgain} />
        </Grid>
        <Grid item md={8} sm={7} xs={7}>
          <Chatting fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Grid>
      </Grid>
    </>
  );
};

export default Chatpage;
