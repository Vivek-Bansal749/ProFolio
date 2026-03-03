import React, { useEffect } from 'react'
import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/UserLayout'
import { useDispatch , useSelector} from 'react-redux'
import { getAllUsers } from '@/config/redux/action/authAction'
import styles from "./index.module.css"
import { BASE_URL } from '@/config';
import {useRouter} from 'next/router';



export default function Discover() {

    const authState = useSelector((state)=> state.auth)

    const dispatch = useDispatch();

    const router = useRouter();

    useEffect(()=>{
        if(!authState.all_profiles_fetched){
            dispatch(getAllUsers());
        }
    },[])


  return (
    <UserLayout>
        <DashBoardLayout>
            <div>
                <h1>Discover Page</h1>

                <div className={styles.allUserProfiles}>
                    {authState.all_profiles_fetched && authState.all_users.map((user)=>{
                        return(
                            <div onClick={()=>{
                                router.push(`/view_profile/${user.userId.username}`)
                            }} key={user._id} className={styles.userProfile}>
                                <img className={styles.userProfile_image} src={user.userId.profilePicture} alt="profile" />
                                <div>
                                    <h1>{user.userId.name}</h1>
                                    <p>{user.userId.email}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </DashBoardLayout>
        
    </UserLayout>
  )
}
