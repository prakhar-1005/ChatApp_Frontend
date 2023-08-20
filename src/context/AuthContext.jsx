import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({})


export const UserContextProvider = ({children})=>{

    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chatsList, setChatsList] = useState([]);
    const [fetchAgain, setFetchAgain] = useState(false);
    const [notification, setNotification] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("user"))

        if(!userInfo){
            navigate("/login")
        }
        setUser(userInfo)

    }, [user]);

    const [name,setName] = useState(null)
    const [id,setId] = useState(null)

    return(
        <AuthContext.Provider value={{user,setUser,name,setName,id,setId,selectedChat,setSelectedChat,chatsList,setChatsList,fetchAgain,setFetchAgain,notification, setNotification}}>
            {children}
        </AuthContext.Provider>
    )
} 

export default AuthContext
