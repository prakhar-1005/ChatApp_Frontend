import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext'
import {Box, Button, useToast,Text,Stack} from '@chakra-ui/react'
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons'
import GroupChatModal from './GroupChatModal'

const MyChats = () => {

    const toast = useToast()

    const [loggedUser, setLoggedUser] = useState();
    
    const getSender = (loggedUser, users) => {
      return users[0]?._id == loggedUser?.id ? users[1].username : users[0].username;
    }

    const {user,setUser,selectedChat,setSelectedChat,chatsList,setChatsList,fetchAgain} = useContext(AuthContext)

    const fetchChats = async ()=>{
        try {      
            const config  ={
              headers:{
                Authorization: `Bearer ${user.token}`
              }
            }
        
            const {data} = await axios.get('https://chat-app-smoky-ten.vercel.app/api/chat/' , config)
            setChatsList(data)
        } catch (error) {
          toast({
              title: "Error Occured!",
              description: error.message,
              status: "error",
              duration: 3000,
              isClosable: true,
              position: "top",
          });
        }
    }

    useEffect(()=>{
      setLoggedUser(JSON.parse(localStorage.getItem("user")))
      fetchChats()
    },[fetchAgain])


  return (
   
      <Box display={{ base: selectedChat ? "none" : "flex", md: "flex" }} flexDir="column" alignItems="center" p={3}  w={{ base: "100%", md: "36%", lg:'31%' }} borderRadius="lg" borderWidth="2px" borderColor="white" fontFamily="Poppins" >
      
        <Box pb={3} px={3} fontSize={{ base: "17px", md: "15px",lg:'25px' }} display="flex" w="100%" justifyContent="space-between" alignItems="center">
          My Chats
          <GroupChatModal>
            <Button display="flex" fontSize={{ base: "12px", md: "13px", lg: "17px" }} size={{base: "sm", md: "md"}} rightIcon={<AddIcon/>}>
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>

        <Box
        display="flex"
        flexDir="column"
        p={3}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chatsList ? (
          <Stack overflowY="scroll">
            {chatsList.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "white":""}
                color={selectedChat === chat ? "black" : "white"}
                px={3}
                py={2}
                border="2px"
                borderColor="white"
                borderRadius="lg"
                key={chat._id}
              >
              {/* {console.log("chat", chat)} */}
                <Text fontWeight="bold">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          {/* <ChatLoading /> */}
        )}
      </Box>
      </Box>
  )
}

export default MyChats
