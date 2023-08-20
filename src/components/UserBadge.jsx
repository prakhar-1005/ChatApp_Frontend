import React from 'react'
import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from '@chakra-ui/react';

const UserBadge = ({ user, handleFunction, admin }) => {

    return (
        <Badge
          px={3}
          py={1}
          borderRadius="lg"
          m={1}
          mb={2}
          variant="solid"
          fontSize={12}
          bg="gray.600"
          cursor="pointer"
          onClick={handleFunction}
        >
          {user.username}
          {admin === user._id && <span> (Admin)</span>}
          <CloseIcon pl={1} />
        </Badge>
      );
}

export default UserBadge
