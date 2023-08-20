import { Avatar, Tooltip } from '@chakra-ui/react'
import React, { useContext } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import AuthContext from '../context/AuthContext'

const ScrollableChat = ({messages}) => {

    const {user} = useContext(AuthContext)


    // This function is used to determine whether the sender of the current message is the same as the sender of the next message. It is used to determine whether an Avatar (user profile picture) should be displayed next to the current message based on the sender's identity and the sender of the next message.
    const isSameSender = (messages, m, i, userId) => {
        return (
            i < messages.length-1 &&
            (messages[i+1].sender._id !== m.sender._id || messages[i+1].sender._id === undefined) && messages[i].sender._id !== userId
          );
    };
      

    //This function is used to determine whether the current message is the last message in the array and whether it was sent by a different user than the current user. It is used to determine whether an Avatar should be displayed next to the last message in the chat, providing a visual indication of the sender's identity.
    const isLastMessage = (messages, i, userId) => {
        return (
          i === messages.length-1 && messages[messages.length-1].sender._id !== userId && messages[messages.length-1].sender._id
        );
    };


    const isSameSenderMargin = (messages, m, i, userId) => {
      
        if (
          i < messages.length - 1 &&
          messages[i + 1].sender._id === m.sender._id &&
          messages[i].sender._id !== userId
        )
          return 33;
        else if (
          (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
          (i === messages.length - 1 && messages[i].sender._id !== userId)
        )
          return 0;
        else return "auto";
    };


    const isSameUser = (messages, m, i) => {
        return i > 0 && messages[i - 1].sender._id === m.sender._id;
    };



  return (
    <ScrollableFeed>
      {messages && messages.map((m,i) =>(

        <div style={{ display: "flex" }} key={m._id}>

            { ( isSameSender(messages, m, i, user.id) || isLastMessage(messages, i, user.id) ) && 
                (
                <Tooltip label={m.sender.username} placement="bottom-start" hasArrow>
                    <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.username}
                    src={m.sender.picture}
                    />
                </Tooltip>
                )
            }


            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user.id ? "white" : "#252B48"
                }`,
                color: `${
                  m.sender._id === user.id ? "#252B48" : "white"
                }`,
                fontWeight:"bold",
                marginLeft: isSameSenderMargin(messages, m, i, user.id),
                marginTop: isSameUser(messages, m, i, user.id) ? 5 : 15,
                borderRadius: "20px",
                padding: "7px 13px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>

        </div>
        )) 
      }
    </ScrollableFeed>
  )
}

export default ScrollableChat
