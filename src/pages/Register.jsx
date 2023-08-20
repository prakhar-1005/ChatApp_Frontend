import React, { useContext, useState } from 'react'
import axios from 'axios'
import Loader from '../images/loader.gif'
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useToast } from '@chakra-ui/react'
import {useNavigate} from "react-router-dom"
import Lottie from 'react-lottie'
import animationData from "../typing/chat.json";

const Register = () => {

    const navigate = useNavigate();

    const toast = useToast()   // for popup warning/error message

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };    
  
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error ,setError] = useState(false)
    const [errMsg,setErrMsg] = useState("")
    const [loading ,setLoading] = useState(false)
    const [picture, setPicture] = useState();
    const [picLoading, setPicLoading] = useState(false);

    const {setName,setId}  = useContext(AuthContext)

    const postDetails = (image)=>{
      setPicLoading(true)

      if (image === undefined) {
        toast({
          title: "Please Select an Image!",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        return;
      }
      // console.log(image);
      if (image.type === "image/jpeg" || image.type === "image/png") {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "chat-app");
        data.append("cloud_name", "dtl80xrxe");
        fetch("https://api.cloudinary.com/v1_1/dtl80xrxe/image/upload", {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            setPicture(data.url.toString());
            // console.log(data.url.toString());
            // console.log("picture",picture);
            setPicLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setPicLoading(false);
          });
      } else {
        toast({
          title: "Please Select an Image!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setPicLoading(false);
        return;
      }
    }


    const handleRegister =async (e)=>{
      e.preventDefault()

      setError(false)
      setLoading(true)

      if (!username || !email || !password || !confirmPassword) {
        toast({
          title: "Please Fill all the Feilds",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setLoading(false);
        return;
      }

      if(password!==confirmPassword){
        toast({
          title: 'Error',
          description: "Passwords do not match",
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top'
        })
        setLoading(false)
        setError(true)
        return
      }

      try { 
        const response = await axios.post('https://chat-app-smoky-ten.vercel.app/api/user/register',{
          username,
          email,
          password,
          picture
        }) 
        setError(false)
        setLoading(false)
        // console.log("this is the response", response);

        toast({
          title: 'Success',
          description: "Account Created",
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top'
        })

        // setting the states in the AuthContext
        setName(response.data.username)
        setId(response.data.id)

        localStorage.setItem("user", JSON.stringify(response.data))   // storing the user info in the localstorage

        navigate('/')

      } catch(err) {
        setLoading(false)
        setError(true)
        setErrMsg(err.response.data.error)
        console.log(err.response.data.error);

        toast({
          title: 'Signup Error',
          description: `Error occured while signup process.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top'
        })     
      }
    }

  return (
      <div className='h-[160vh] pt-20 bg-gray-900 font-poppins text-white'>
        <h1 className='mb-3 text-center text-white md:text-xl text-md font-bold'>WELCOME TO CHIT-CHAT</h1>
        <h2 className='text-center text-white md:text-xl text-md font-semibold'>REGISTER</h2>
        <Lottie options={defaultOptions} width={60} height={60} style={{margin:'auto'}}/>
        <form action="/login" method='post' className='mx-auto w-64' onSubmit={handleRegister} >
            <input type="text" placeholder='Username' value={username} onChange={(e)=>{setUsername(e.target.value)}} className=' px-2 py-2 w-full my-5 block bg-gray-500 text-white rounded-lg border-2 border-[#11999E]' />

            <input type="email" placeholder='Email' value={email} onChange={(e)=>{setEmail(e.target.value)}} className=' px-2 py-2 w-full my-5 block bg-gray-500 text-white rounded-lg border-2 border-[#11999E]' />

            <input type="password" placeholder='Password' value={password} onChange={(e)=>{setPassword(e.target.value)}} className='px-2 py-2 w-full my-5 block bg-gray-500 text-white rounded-lg border-2 border-[#11999E]' />
            
            <input type="password" placeholder='Confirm Password' value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}} className='px-2 py-2 w-full my-5 block bg-gray-500 text-white rounded-lg border-2 border-[#11999E]' />
            
            <input type="file" className='mb-2 cursor-pointer' onChange={(e) => postDetails(e.target.files[0])} placeholder='Upload an Image' accept="image/png, image/jpeg" />
           
            <button className='py-2 w-full block bg-[#11999E] hover:bg-[#30E3CA] text-white font-bold rounded-lg'>Register</button>
        </form>

        {loading && <span className='mt-5 flex justify-center '>Please Wait....</span>}
        {loading && <img src={Loader} alt="Loader" className="h-16 w-16 m-auto" />}
        {error && <div className='text-white mt-5 flex justify-center'>{errMsg}</div>}

        <p className='text-center pt-4'> Already Registered? <Link className='font-bold' to="/login">Login</Link> </p>
      </div>
  )
}

export default Register
