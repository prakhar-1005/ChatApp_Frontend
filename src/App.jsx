import { useContext, useEffect, useState } from "react"
import Login from "./pages/Login"
import Register from "./pages/Register"
import {Routes, Route, useNavigate} from 'react-router-dom'
import ChatPage from "./pages/ChatPage"

function App() {

  const navigate = useNavigate();

  useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem("user"))
      if(userInfo){
          navigate("/");
      }
  }, []);

  return (
    <>   
        <div>
            <Routes>
              <Route path="/" element={<ChatPage/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/register" element={<Register/>}/>
            </Routes>
        </div>
    </>
  )
}

export default App
