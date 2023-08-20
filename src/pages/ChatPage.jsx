import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import SideBar from '../components/SideBar'
import MyChats from '../components/MyChats'
import ChatBox from '../components/ChatBox'

const ChatPage = () => {
  
  const {user} = useContext(AuthContext)


  return (
    <div className='w-[100%] bg-gray-900 font-poppins text-white'>
      {user && <SideBar/>}
      <div className='flex justify-between w-[100%] h-[93vh] p-[10px]'>
        {user && <MyChats/>}
        {user && <ChatBox/>}
      </div>
    </div>
  )
}

export default ChatPage
