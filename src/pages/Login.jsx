import React, { useContext, useState } from 'react'
import axios from 'axios'
import Loader from '../images/loader.gif'
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {useNavigate} from "react-router-dom"
import { useToast } from '@chakra-ui/react'
import Lottie from 'react-lottie'
import animationData from "../typing/chat.json";


const Login = () => {

  const navigate = useNavigate();

  const toast = useToast()  

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };    


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error ,setError] = useState(false)
  const [errMsg,setErrMsg] = useState("")
  const [loading ,setLoading] = useState(false)

  const {setName,setId} = useContext(AuthContext)

  const handleLogin = async (e)=>{
    e.preventDefault()
    setLoading(true)
    setError(false)

    try {
      const response = await axios.post('https://chit-chat-backend-zge8.onrender.com/api/user/login',{
        username,
        password
      })
      setLoading(false)
      setError(false)
      toast({
        title: 'Success',
        description: "Login Successful",
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top'
      })

      setName(response.data.username)
      setId(response.data.id)

      localStorage.setItem("user", JSON.stringify(response.data))   // storing the user info in the localstorage
      
      navigate('/')

    } catch (err) {
        setLoading(false)
        setError(true)
        setErrMsg(err.response.data.error)
        console.log(err.response.data.error); 
        
        toast({
          title: 'Login Error',
          description: "Error occured while login process",
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top'
        })
        
      }
  }


  return (
    <div className='h-[130vh] pt-36 bg-gray-900 font-poppins'>
      <Lottie options={defaultOptions} width={100} height={100} style={{margin:'auto'}}/>
      <h1 className='pt-4 text-center text-white md:text-xl text-md font-bold'>WELCOME BACK!! LOGIN TO CONTINUE</h1>
      <form action="/login" method='post' className='mx-auto w-64' onSubmit={handleLogin}>
          <input type="text" placeholder='Username' value={username} onChange={(e)=>{setUsername(e.target.value)}} className=' px-2 py-2 w-full my-5 block bg-gray-500 text-white rounded-lg border-2 border-[#11999E]' />

          <input type="password" placeholder='Password' value={password} onChange={(e)=>{setPassword(e.target.value)}} className='px-2 py-2 w-full my-5 block bg-gray-500 text-white rounded-lg border-2 border-[#11999E]' />
          <button className='py-2 w-full block bg-[#11999E] hover:bg-[#30E3CA] text-white font-bold rounded-lg'>Login</button>
      </form>

      {loading && <span className='mt-5 flex justify-center '>Please Wait....</span>}
      {loading && <img src={Loader} alt="Loader" className="h-16 w-16 m-auto" />}
      {error && <div className='text-white mt-5 flex justify-center'>{errMsg}</div>}


      <p className='text-center pt-4 text-white'> Not Registered? <Link className='font-bold' to="/register">Register</Link> </p>

    </div>
   
  )
}

export default Login