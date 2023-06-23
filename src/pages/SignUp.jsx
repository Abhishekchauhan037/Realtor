import React, { useState } from 'react'
import {AiFillEyeInvisible,AiFillEye} from 'react-icons/ai'
import { Link } from 'react-router-dom';
import OAuth from '../Components/OAuth';
import {getAuth,createUserWithEmailAndPassword,updateProfile} from "firebase/auth"
import {db} from "../firebase";
import { serverTimestamp } from 'firebase/firestore';
import { setDoc,doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const SignUp = () => {

    const [showPassword,setShowPassword] = useState(false);
    const [formData,setFormData] = useState({

        name:"",
        email:"",
        password:"",
    });
    const {email,password,name} = formData;
    const navigate = useNavigate();

    function onChange(event){

        setFormData((prevState)=>({
            ...prevState,
            [event.target.id]: event.target.value,
            
        }))
    }
   async function onSubmit(event){

        event.preventDefault();
        try{

            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth,email,password);

            updateProfile(auth.currentUser,{
                displayName:name
            })

            const user = userCredential.user;
            const formDataCopy = {...formData}
            delete formData.password;
            formDataCopy.timestamp = serverTimestamp();

            await setDoc(doc(db,"users",user.uid),formDataCopy);
            toast.success("Sign up was successful")
            navigate('/');

        }  catch(error){

            toast.error("Something Went Wrong With the registration ");

            console.log(error);


        }

    }
  return (
    <section >
        <h1 className='text-3xl text-center mt-6 font-bold'>Sign Up</h1>

        <div className='flex justify-center flex-wrap items-center px-6 py-12  mx-auto '>
            {/* for login  Image  */}

            <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6 '>
                <img src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=773&q=80" alt="" 
                
                className='w-full rounded-2xl '/>
            </div>

            {/* for form */}
            <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
                <form onSubmit={onSubmit} >
                     <input className='w-full px-4 py-2 text-xl text-gray-700
                    bg-white border-gray-300  rounded transition ease-in-out'
                    type="text" name="name" id="name" value={name} onChange={onChange} placeholder='Full Name'/>

                

                   <input className='w-full px-4 py-2 text-xl text-gray-700 mt-6
                    bg-white border-gray-300  rounded transition ease-in-out'
                    type="email" name="email" id="email" value={email} onChange={onChange} placeholder='Email Address'/>

                    <div className='relative mt-8'>

                    <input className='w-full px-4 py-2 text-xl text-gray-700
                    bg-white border-gray-300  rounded transition ease-in-out'
                    type={showPassword? "text":"password"} id="password" name="password" value={password} onChange={onChange} placeholder='Password' />
                   
                    {showPassword ? (<AiFillEyeInvisible className='absolute right-3 top-3 text-xl cursor-pointer'
                       onClick={()=>setShowPassword((prevState)=> !prevState)}  />) :

                    (<AiFillEye className='absolute right-3 top-3 text-xl cursor-pointer'  onClick={()=>setShowPassword((prevState)=> !prevState)} />)}
                        
                    </div>

                    <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
                        <p className='mt-6'>Have a account? <Link to="/sign-in" 
                        className='text-red-600 hover:text-red-800 transition duration-200 ease-in-out ml-1'>Sign In</Link></p>
                        <p className='mt-6'> <Link to="/forgot-password"
                        className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out ml-1'>Forgot password?</Link></p>
                    </div>

                        
                        <button className='w-full bg-blue-600 text-white px-7 py-3 font-medium
                    uppercase rounded shadow-md  hover:bg-blue-700 transition duration-200 hover:shadow-lg
                    ease-in-out mt-6 active:bg-blue-800' type='submit'> Sign Up</button>
                    
                    <div className='flex items-center my-4 before:border-t  before:flex-1  before::border-gray-300 
                    after:border-t  after:flex-1  after::border-gray-300 '>
                        <p className='text-center font-semibold mx-4'>OR</p>
                    </div>
                    <OAuth/>
                </form>

               
            </div>

        </div>
    </section>
  )
}

export default SignUp