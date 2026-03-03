import React, { useEffect } from 'react'
import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/UserLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getMyConnectionRequests, acceptConnectionRequest } from '@/config/redux/action/authAction';
import { BASE_URL } from '@/config';
import styles from "./index.module.css"
import { useRouter } from 'next/router';


export default function MyConnections() {

  const dispatch = useDispatch();

  const router = useRouter();

  const authState = useSelector((state)=>state.auth);

  useEffect(()=>{
    dispatch(getMyConnectionRequests({token: localStorage.getItem("token")}));
  },[])

  useEffect(()=>{
    if(authState.connectionRequests != 0 ){
        console.log("Connection request response", authState.connectionRequests);
    }
  },[authState.connectionRequests])

  return (
    <UserLayout>
        <DashBoardLayout>
            <div style={{display:"flex",flexDirection:"column",gap:"1.7rem"}}>
                <h4>My Connections</h4>
                {authState.connectionRequests.length === 0 && <h2>No connection requests at the moment</h2>}
                {authState.connectionRequests.length !=0 && authState.connectionRequests.filter((connection) => connection.status_accepted === null).map((user) => {
                  return (
                    <div onClick={()=>{
                      router.push(`/view_profile/${user.userId.username}`)
                    }} className={styles.userCard} key={user._id}>
                      <div style={{display:"flex",alignItems:"center",gap:"1.2rem",justifyContent:"space-between"}}>
                          <div className={styles.profilePicture}>
                          <img src={user.userId.profilePicture} alt="Profile Picture"  />
                        </div>
                        <div className={styles.userInfo}>
                          <h3>{user.userId.name}</h3>
                          <p>{user.userId.username}</p>
                        </div>
                        <button onClick={(e)=> {e.stopPropagation()
                          dispatch(acceptConnectionRequest({
                            token: localStorage.getItem("token"),
                            connectionId: user._id,
                            action: "accept"
                          }))
                        }

                        } className={styles.connectedBtn}>Accept</button>
                      </div>
                    </div>
                  )
                    
                })}
                <h4>My Network</h4>
                {authState.connectionRequests.filter((connection) => connection.status_accepted !== null).map((user,index)=>{
                  return (
                    <div onClick={()=>{
                      router.push(`/view_profile/${user.userId.username}`)
                    }} className={styles.userCard} key={user._id}>
                      <div style={{display:"flex",alignItems:"center",gap:"1.2rem",justifyContent:"space-between"}}>
                          <div className={styles.profilePicture}>
                          <img src={user.userId.profilePicture} alt="Profile Picture"  />
                        </div>
                        <div className={styles.userInfo}>
                          <h3>{user.userId.name}</h3>
                          <p>{user.userId.username}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}

            </div>
        </DashBoardLayout>
        
    </UserLayout>
  )
}
