import { Avatar, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Image, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useContext, useState } from 'react'
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import AuthContext from '../context/AuthContext';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchLoading from './SearchLoading';

const SideBar = () => {
    
    const { isOpen, onOpen, onClose } = useDisclosure()

    const navigate = useNavigate()
    const toast = useToast()

    const {user,setSelectedChat,chatsList,setChatsList} = useContext(AuthContext)

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);


    const handleKeyDown = (e) =>{
        if(e.key==='Enter')
            handleSearch()

        return    
    }


    const handleSearch = async ()=>{
        if(!search) 
            return;

        try {
            setLoading(true);
        
            const config = {
                headers: {
                Authorization: `Bearer ${user.token}`,
                },
            };
        
            const { data } = await axios.get(`https://chit-chat-backend-zge8.onrender.com/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
            // console.log(data);
        } catch (error) {
            setLoading(false);
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    const handleChatList = async (userId)=>{   
        try {
            setLoadingChat(true)
            const config={
                headers:{
                    "Content-type":"application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.post('https://chit-chat-backend-zge8.onrender.com/api/chat/',{userId},config)   // axios syntax -> url, body, header
            // console.log("this is data",data);
            
            if (!chatsList.find((c) => c._id===data._id)) { //if it finds that the chat is not present, it is going to append chatsList
                setChatsList([data, ...chatsList])
            }
            // console.log(chatsList);
            setSelectedChat(data)
            setLoadingChat(false)
            onClose()  // closing the sideBar after the chat is added
        } catch (error) {
            setLoadingChat(false)            
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


    const handleLogout = ()=>{
        localStorage.removeItem("user")
        navigate('/login')
        toast({
            title: 'Success',
            description: "Successfully Logged Out",
            status: 'success',
            duration: 4000,
            isClosable: true,
            position: 'top'
          })
    }

  return (
    <div className='font-poppins'>
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            w="100%"
            p="5px 10px 5px 10px"
            // borderWidth="5px"
        >
           <Tooltip label="Search for Users to chat" hasArrow placement='bottom-end'>
                <Button variant="" onClick={onOpen}>
                    <i className="fa-solid fa-magnifying-glass" style={{"color": "#ffffff"}}></i>
                    <Text display={{ base: "none", md: "flex" }} px={5}>
                        Search User
                    </Text>
                </Button>
           </Tooltip> 
           <Text fontSize="2xl" as='b'>
                Chit-Chat
            </Text>
            
            <div>
                <Menu>
                    <MenuButton p={1}>
                        <BellIcon fontSize="2xl" mx={4} />
                    </MenuButton>
                </Menu>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                        <Avatar size="sm" name={user.username} src={user.picture} cursor="pointer" />
                    </MenuButton>
                    <MenuList textColor="gray.900" fontWeight="bold">
                        <ProfileModal>
                            <MenuItem>My Profile</MenuItem>
                        </ProfileModal>
                        <MenuDivider/>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </Box>

        <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="gray.800" textColor="white">
          <DrawerCloseButton />
          <DrawerHeader>Search for a User</DrawerHeader>

          <DrawerBody display="flex" flexDir="column">
                <Box display="flex" justifyContent="center" alignItems="center" pb={2}>
                    <Input value={search} onKeyDown={handleKeyDown} onChange={(e)=>setSearch(e.target.value)} placeholder='Search name or email' />
                    <Button ml={2} textColor="white" colorScheme='cyan' onClick={handleSearch}>Search</Button>
                </Box>

                <Box display="flex" flexDir="column" justifyContent="space-around">
                    {loading ? <SearchLoading/> : searchResult?.map((res) =>(
                           
                            <Box key={res._id} cursor="pointer" onClick={()=>handleChatList(res._id)} _hover={{ background: "white", color: "#252B48", fontWeight:"bold", border:"2px", borderColor:"#252B48"}} display="flex" alignItems="center" justifyContent="space-around" bg="gray.900" textColor="white" border="2px" borderColor="white" fontFamily="Poppins" rounded="2xl" p="2" my="2" >
                                <Image boxSize="10" objectFit="cover" borderRadius="full" src={res.picture} alt={user.username}/>
                                <Text>{res.username}</Text>
                                <Text fontSize="xs" >{res.email}</Text>
                            </Box>       
                        ))  
                    }
                </Box>
                {loadingChat && <Spinner ml="auto" d="flex" /> }
          </DrawerBody>
          <DrawerFooter>
            <Button mr={1} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default SideBar
