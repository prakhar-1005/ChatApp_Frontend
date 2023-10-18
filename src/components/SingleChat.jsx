import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import ProfileModal from './ProfileModal'
import UpdateGroupModal from './UpdateGroupModal'
import axios from 'axios'
import '../index.css'
import ScrollableChat from './ScrollableChat'
import { io } from "socket.io-client";
import Lottie from 'react-lottie'
import animationData from "../typing/typing.json";

const ENDPOINT = "https://chit-chat-backend-zge8.onrender.com"
var socket, selectedChatCompare

const SingleChat = () => {

    const toast = useToast()

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const {user,selectedChat,setSelectedChat,fetchAgain,setFetchAgain} = useContext(AuthContext)


    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
    };    


    const fetchMessages = async () => {
        if (!selectedChat) 
            return;

        try {
            const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
            };

            setLoading(true);

            const { data } = await axios.get(`https://chit-chat-backend-zge8.onrender.com/api/message/${selectedChat._id}`, config );
            setMessages(data);
            setLoading(false);
            socket.emit("join chat", selectedChat);
            // console.log(data);
        } catch (error) {
            
            setLoading(false);
            toast({
            title: "Error Occured!",
            description: "Failed to Load the Messages",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top",
            });
        }
    };


    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {

          socket.emit("stop typing", selectedChat._id);
          
          try {
            const config = {
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            };
            setNewMessage("");
            const { data } = await axios.post("https://chit-chat-backend-zge8.onrender.com/api/message",
              {
                content: newMessage,
                chatId: selectedChat,
              },
              config
            );
            socket.emit("new message", data);  // this is used for sending the message to teh socket "new message"  
            // console.log(data);
            setMessages([...messages, data]);

          } catch (error) {
            toast({
              title: "Error Occured!",
              description: "Failed to send the Message",
              status: "error",
              duration: 3000,
              isClosable: true,
              position: "top",
            });
          }
        }
    };
    

    const typingHandler = (e)=>{

        setNewMessage(e.target.value)

        if (!socketConnected) return;  

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime(); // used to stop the typing animation in case the user has stopped typing for 3 seconds  
        var timerLength = 3000;
        
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    } 

    
    const getChatData = (loggedUser, users) => {
        return users[0]?._id == loggedUser?.id ? users[1] : users[0];
    }


    // this useEffect is above all the others for the sockets to be initialized first
    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit("setup",user)
        socket.on('connected' , ()=>{
            setSocketConnected(true)
        })
        socket.on("typing" ,()=> setIsTyping(true))
        socket.on("stop typing" ,()=> setIsTyping(false))

    }, []);


    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat
    }, [selectedChat]);

    // this useEffect is used for receiving the message from the socket "message received"
    useEffect(() => {
        socket.on("message received", (newMessageRecieved) => {  // checks we a message is received from this socket

        // if() statement checks for the cases -> when none of the chats is selected  ||  the message received is from a chat which is not equal to the currently selected chat  
        // In these 2 cases we cannot add the new message to the messages array and display it, instead we must create a notification
        if ( !selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) { 
            // if (!notification.includes(newMessageRecieved)) {
            //   setNotification([newMessageRecieved, ...notification]);
            //   setFetchAgain(!fetchAgain);
            // }
          } 
          else {
            setMessages([...messages, newMessageRecieved]);
          }

        });
      });  // no dependency array is used here



  return (
    <>
        {selectedChat ? 
            <>
            <Text fontSize={{ base: "23px", md: "28px" }} pb={3} px={2} w="100%" fontFamily="Poppins" display="flex" justifyContent={{ base: "space-between" }} alignItems="center">
                <IconButton display={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat("")} />
                {!selectedChat.isGroupChat ? ( 
                    <>
                        {getChatData(user, selectedChat.users).username}
                        <ProfileModal userSelected={getChatData(user, selectedChat.users)}/>
                    </>    
                )
                :
                (
                    <>                 
                        {selectedChat.chatName}
                        <UpdateGroupModal fetchMessages={fetchMessages} />
                    </>
                )
                }   

            </Text>
                <Box display="flex" flexDir="column" justifyContent="flex-end" p={3} w="100%" h="100%" borderRadius="lg" overflowY="hidden">
                    
                    {loading ? <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto"/> :
                        (<div className="flex flex-col overflow-y-scroll scrollbarhide">
                          <ScrollableChat messages={messages} />
                        </div>
                        )
                    }

                    <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3}>
                        {isTyping ? <div>
                        <Lottie 
                            options={defaultOptions}
                            width={100}
                            style={{ marginBottom: 15, marginLeft: 0 }}
                        /></div> : <></> }
                        <Input variant="filled" bg="gray.800" border="2px" borderColor="white" size="lg" placeholder="Enter a message.." value={newMessage} onChange={typingHandler}/>
                    </FormControl>
                
                </Box>
            </> 
            :
            <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize="3xl" pb={3} textColor="gray.600" fontFamily="Poppins">Click on a user to start chatting</Text>
            </Box> 
        }
    </>
  )
}

export default SingleChat
