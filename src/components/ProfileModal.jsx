import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const ProfileModal = ({userSelected,children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const {user} = useContext(AuthContext)

  return (
    <div className='font-poppins'>
      {children ? 
        (<span onClick={onOpen}>{children}</span>) :
        (<IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen} />)
      }

      <Modal size={{base:"xs", md:"sm"}} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="410px" bg="gray.800" textColor="white">
          <ModalHeader  
            fontSize="25px"
            fontFamily="Poppins"
            display="flex"
            justifyContent="center">{!userSelected ? user.username : userSelected.username}</ModalHeader>
          
          <ModalCloseButton />

          <ModalBody display="flex" flexDir="column" alignItems="center" fontFamily="Poppins" justifyContent="space-evenly" >
            <Image borderRadius="full" border="2px" borderColor="white" boxSize="130px" objectFit="cover" src={!userSelected ? user.picture : userSelected.picture} alt={!userSelected ? user.username : userSelected.username}/>
            <Text fontSize={{ base: "16px", md: "20px" }}> Email: {!userSelected ? user.email : userSelected.email} </Text>
          </ModalBody>

          <ModalFooter fontFamily="Poppins">
            <Button mr={3} onClick={onClose}>Close</Button>
          </ModalFooter>
        
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ProfileModal
