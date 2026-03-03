import UserLayout from '@/layout/UserLayout'
import React, { useEffect,useState } from 'react'
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css"
import { registerUser,loginUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';


function LoginComponent() {

    const authState = useSelector((state)=>state.auth);

    const router = useRouter();

    const dispatch = useDispatch();

    const [userLoginMethod,setUserLoginMethod] = useState(false);

    const [username,setUsername] = useState("");
    const [name,setName] = useState("");
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");



    useEffect(() => {
        if (authState.loggedIn) {
            router.replace("/dashboard");
        }
    }, [authState.loggedIn, router]);


    useEffect(()=>{
        dispatch(emptyMessage());
    },[userLoginMethod])


    const handleRegister = ()=>{
        console.log("registering...");
        dispatch(registerUser({username,password,email,name}))
    }

    const handlelogin = ()=>{
        console.log("logging in...");
        dispatch(loginUser({email, password}))
    }

  return (


    <UserLayout>
        
        <div className={styles.container}>
            <div className={styles.cardContainer}>

            <div className={styles.cardContainer_left}>
                <p className={styles.cardleft_heading}>{userLoginMethod ? "Sign In":"Sign Up"}</p>
                {/* {authState.message.message} */}
                <p style={{color: authState.isError ? "red":"green"}}>
                            {typeof authState.message === 'string' 
                                ? authState.message 
                                : authState.message?.message}
                        </p>

                <div className={styles.inputContainer}>
                    {!userLoginMethod && <div className={styles.inputRow}>
                        <input onChange={(e)=>setUsername(e.target.value)} className={styles.inputField}  type="text" placeholder='Username' />
                        <input onChange={(e)=> setName(e.target.value)} className={styles.inputField}  type="text" placeholder='Name' />
                    </div>}
                    <input onChange={(e)=> setEmail(e.target.value)} className={styles.inputField}  type="text" placeholder='E-mail' />
                    
                    <input onChange={(e)=>setPassword(e.target.value)} className={styles.inputField}  type="text" placeholder='Password' />

                    <div className={styles.buttonWithOutline} onClick={()=>{
                        if(userLoginMethod){
                            handlelogin();
                        }else{
                            handleRegister();
                        }
                    }}>
                        <p>{userLoginMethod? "Sign In":"Sign Up"}</p>
                    </div>
                </div>

                
            </div>

            <div className={styles.cardContainer_right}>
                    {userLoginMethod ? <p> Don't have an account</p>:<p>Already have an account</p>}
                    <div onClick={()=>{
                        setUserLoginMethod(!userLoginMethod)
                    }} style={{color:"black",textAlign:"center"}} className={styles.buttonWithOutline}>
                        <p onClick={()=>handlelogin}>{userLoginMethod ? "Sign Up":"Sign In"}</p>
                    </div>
            </div>
            
        </div>
        </div>


    </UserLayout>
  )
}

export default LoginComponent