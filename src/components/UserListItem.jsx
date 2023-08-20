import { Avatar, Box, Text } from "@chakra-ui/react";

const UserListItem = ({ handleFunction,user }) => {

  return (
    <Box onClick={handleFunction} cursor="pointer" bg="#E8E8E8" _hover={{ background: "gray.700", color: "white",}}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar mr={2} size="sm" cursor="pointer" name={user.username} src={user.picture} />
      <Box>
        <Text>{user.username}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;