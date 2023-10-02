import { React, useEffect } from "react";
import { Routes, Route, useNavigate} from "react-router-dom";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup.jsx";
import Chatpage from "./components/chat/Chatpage";
import { ChatState } from "./Context/ChatProvider";
import "./App.css"

const App = () => {

  const Navigate=useNavigate();
  const {user}=ChatState();

  useEffect(()=>{
    if(!user){
      Navigate("/")
    }
    else{
      Navigate("/chat")
    }
  },[])
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} exact />
        <Route path="/chat" element={<Chatpage />} />
      </Routes>
    </div>
  );
};

export default App;
