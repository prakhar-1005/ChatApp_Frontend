import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import UserBadge from './UserBadge'
import axios from 'axios'
import UserListItem from './UserListItem'

const UpdateGroupModal = ({fetchMessages}) => {
    
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [groupName, setGroupName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);

    const toast = useToast();

    const {user,setSelectedChat,selectedChat,fetchAgain,setFetchAgain} = useContext(AuthContext)
  

    const handleSearch = async (query)=>{
        if(!query)
            return 
        
        try {    
            setLoading(true)
            setSearch(query)

            const config={
                headers:{
                    Authorization: `Bearer ${user.token}`
                },
            }

            const {data} = await axios.get(`https://chit-chat-backend-zge8.onrender.com/api/user?search=${search}`,config)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            setLoading(false)
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom",
              });
        }
    }


    const handleRename = async()=>{ 
        if(!groupName)
            return

        try {
            setRenameLoading(true)

            const config={
                headers:{
                    Authorization: `Bearer ${user.token}`
                },
            }

            const {data} =await axios.put('https://chit-chat-backend-zge8.onrender.com/api/chat/rename',{
                groupId: selectedChat._id,
                name: groupName
            },config)
            console.log("this is data",data);
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            setRenameLoading(false)
            toast({
                title: "Error Occured!",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom",
              });
              console.log("Error",error.message);
        }
        setGroupName("");
    }


    const handleAddUser = async (user1) => {
      if (selectedChat.users.find((u) => u._id == user1._id)) {
        toast({
          title: "User Already in group!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
  
      // if (selectedChat.groupAdmin !== user._id) {
      //   toast({
      //     title: "Only admins can add someone!",
      //     status: "error",
      //     duration: 3000,
      //     isClosable: true,
      //     position: "bottom",
      //   });
      //   return;
      // }
  
      try {
        setLoading(true);

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.put('https://chit-chat-backend-zge8.onrender.com/api/chat/groupadd',
          {
            userId: user1._id,
            groupId: selectedChat._id,
          },
          config
        );
  
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
      setGroupName("");
    };


    const handleRemove = async (user1) => {
      console.log("user1",user1);

      // if (selectedChat.groupAdmin !== user.id && user1._id !== user.id) {
      //   toast({
      //     title: "Only admins can remove someone!",
      //     status: "error",
      //     duration: 3000,
      //     isClosable: true,
      //     position: "bottom",
      //   });
      //   return;
      // }
  
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put(`https://chit-chat-backend-zge8.onrender.com/api/chat/groupremove`,
          {
            userId: user1._id,
            groupId: selectedChat._id,
          },
          config
        );
  
        user1._id == user.id ? setSelectedChat() : setSelectedChat(data);  // if user has removed himself then we hide the group from him
        setFetchAgain(!fetchAgain);
        fetchMessages();
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
      setGroupName("");
    };
  


    return (
    <>
        <IconButton display={{ base: "flex" }} icon={<ViewIcon/>} onClick={onOpen}/>
        <Modal size={{base:"xs", md:"sm"}} isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent fontFamily="Poppins" bg="gray.800" textColor="white">
          <ModalHeader
            fontSize="28px"
            fontFamily="Poppins"
            display="flex"
            justifyContent="center"
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                {selectedChat.users.map(u =>(
                    <UserBadge key={u._id} user={u} handleFunction={() => handleRemove(u)} />
                ))}
            </Box>

            <FormControl display="flex">
              <Input
                placeholder="Rename Group"
                mb={3}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <Button
                variant="solid"
                // colorScheme="teal"
                bg="gray.800"
                textColor="white"
                border="1px"
                borderColor="white"
                _hover={{ bg:"white",textColor:"gray.800"}}
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="md" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user.id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}

          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>   
    </>
  )
}

export default UpdateGroupModal
