import React, { useContext } from 'react'
import { Box } from "@chakra-ui/react";
import AuthContext from '../context/AuthContext';
import SingleChat from './SingleChat';

const ChatBox = () => {

  const {selectedChat,fetchAgain,setFetchAgain} = useContext(AuthContext)

  return (
    
    <Box display={{ base: selectedChat ? "flex" : "none", md: "flex" }} alignItems="center" flexDir="column" p={3}  w={{ base: "100%", md: "68%" }} borderRadius="lg" borderWidth="2px">
      <SingleChat/>
    </Box>  
  )
}

export default ChatBox
