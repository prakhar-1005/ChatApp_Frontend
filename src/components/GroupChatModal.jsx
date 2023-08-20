import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import UserListItem from './UserListItem';
import UserBadge from './UserBadge';

const GroupChatModal = ({children}) => {

    const { isOpen, onOpen,onClose } = useDisclosure()

    const [groupName, setGroupName] = useState();
    const [groupUsers, setGroupUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading,setLoading] = useState(false)

    const {user,chatsList,setChatsList} =useContext(AuthContext)

    const toast = useToast()


    // used for searching users in the group modal 
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

            const response = await axios.get(`https://chat-app-smoky-ten.vercel.app/api/user?search=${search}`,config)
            // console.log(response);
            // console.log(Array.isArray(data));  -> true
            setLoading(false)
            setSearchResult(response.data)
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
            // console.log(error.message);
        }
    }


    // used to add users to  the group
    const handleGroup = (userToBeAdded)=>{
        if(!userToBeAdded)
            return 

        if(groupUsers.includes(userToBeAdded)){
            toast({
                title: "User already added!",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "bottom",
              });
              return 
        }
        setGroupUsers([...groupUsers , userToBeAdded]); 
    }


    // used to remove a user (not from the group but from the list which is about to be added)
    const handleDelete = (userToBeRemoved) =>{
        if(!userToBeRemoved)
        return 

        if(groupUsers.includes(userToBeRemoved)){
            setGroupUsers(groupUsers.filter((us)=>us._id !== userToBeRemoved._id)); 
            return 
        }
    }   


    // used to create the new group
    const handleSubmit = async ()=>{
        if( !groupName || !groupUsers ){
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "bottom",
              });
              return 
        }

        try { 
            setLoading(true)

            const config={
                headers:{
                    Authorization: `Bearer ${user.token}`
                },
            }
    
            const {data} = await axios.post('https://chat-app-smoky-ten.vercel.app/api/chat/group',{
                name:groupName,
                users: JSON.stringify(groupUsers.map((u) => u._id))  
              /*  1) groupUsers is an array of objects, each representing a user.
                  
                  2) .map((u) => u._id) is using the map() function to create a new array containing only the _id property of each user object. This is assuming that each u object has an _id property that uniquely identifies the user.
                  
                  3) JSON.stringify(...) is converting the resulting array of _id values into a JSON-formatted string. This is necessary because when you send data in a request payload, it's usually expected to be in JSON format.*/

            },config)

            setChatsList([data, ...chatsList])
            setLoading(false)
            onClose()
            toast({
              title: "Succcess",
              description: "Successfully Created the Group",
              status: "success",
              duration: 3000,
              isClosable: true,
              position: "bottom",
            });
        } catch (error) {
            setLoading(false)
            toast({
                title: "Error Occured",
                description: "Failed to Create the Group",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom",
              });
        }

    }


  return (
    <div>

      <span onClick={onOpen}>{children}</span>

      <Modal size={{base:"xs", md:"md"}} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="25px" textColor="gray.800" fontFamily="Poppins" display="flex" justifyContent="center">
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textColor="gray.800" display="flex" flexDir="column" alignItems="center">
            <FormControl>
            <Input placeholder="Chat Name" mb={3} onChange={(e) => setGroupName(e.target.value)} />
            </FormControl>
            <FormControl>
              <Input placeholder="Add Users" mb={1} onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            <Box w="100%" d="flex" flexWrap="wrap">
              {groupUsers.map((u) => (
                <UserBadge key={u._id} user={u} handleFunction={() => handleDelete(u)} />
              ))}
            </Box>

            {loading ? ( <Spinner/> ) : (
              searchResult?.slice(0, 4).map((user) => (
                  <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} textColor="white" bg='#252B48' _hover={{textColor:"white", bg:'gray.800'}} onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )

}
export default GroupChatModal

