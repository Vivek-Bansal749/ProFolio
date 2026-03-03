import React, { useEffect, useState } from 'react'
import { BASE_URL, clientServer } from '@/config'
import { useSearchParams } from 'next/navigation'
import UserLayout from '@/layout/UserLayout';
import DashBoardLayout from '@/layout/DashBoardLayout';
import styles from "./index.module.css"
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionsRequest, getMyConnectionRequests, sendConnectionRequest } from '@/config/redux/action/authAction';

export default function ViewProfilePage({userProfile}) {

    const router = useRouter();
    const postReducer = useSelector((state)=>state.postReducer);
    const dispatch = useDispatch();

    const authState = useSelector((state)=>state.auth)

    const [isConnectionRequestSent, setIsConnectionRequestSent] = useState(true);

    const [userPosts,setUserPosts]=useState([])

    const[isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);

    const getUserPost  = async()=>{
        await dispatch(getAllPosts());
        await dispatch(getConnectionsRequest({token: localStorage.getItem("token")}));
        await dispatch(getMyConnectionRequests({token: localStorage.getItem("token")}));
        // connections are fetched separately below
    }

    useEffect(()=>{
        // whenever posts or the username change, filter for posts by this user
        const filtered = postReducer.posts.filter((p)=>{
            return p.userId?.username === router.query.username;
        });
        setUserPosts(filtered);
    },[postReducer.posts]);

    useEffect(()=>{
        // fetch current user's connections once
        dispatch(getConnectionsRequest({token: localStorage.getItem("token")}));
    }, [dispatch]);

    useEffect(()=>{
    console.log(authState.connections, userProfile.userId._id)
    const connection = authState.connections.find(user => user.connectionId?._id === userProfile.userId._id);
    if(connection){
        setIsCurrentUserInConnection(true);
        if(authState.connections.find(user => user.connectionId?._id === userProfile.userId._id).status_accepted === true){
                setIsConnectionRequestSent(false);
        }
    }


    const connectionrequest = authState.connectionRequests.find(user => user.userId?._id === userProfile.userId._id);
    if(connectionrequest){
        setIsCurrentUserInConnection(true);
        if(connectionrequest.status_accepted === true){
                setIsConnectionRequestSent(false);
        }
    }

    
    
},[authState.connections, authState.connectionRequests, userProfile.userId._id])

    const searchParamers = useSearchParams();
    useEffect(()=>{
        getUserPost();
    },[]);
  return (
    <UserLayout>
        <DashBoardLayout>
            <div className={styles.container}>
                <div className={styles.backDropContainer}>
                    <img src={userProfile.userId.profilePicture} alt="Profile" />
                </div>

                <div className={styles.profile_container_details}>
                    <div className={styles.profile_container_flex}>
                        <div style={{flex:"0.8"}}>

                            <div style={{display:"flex",width:"fit-content",alignItems:"center",gap:"1.2rem"}}>
                                <h2>{userProfile.userId.name}</h2>
                                <p style={{color:"grey"}}>@{userProfile.userId.username}</p>
                            </div>
                            <div style={{display:"flex",alignItems:"center", gap:"1.2rem"} }>
                                {
                                isCurrentUserInConnection? 
                                <button className={styles.connectedBtn}>{isConnectionRequestSent? "Pending": "Connected"}</button>:
                                <button onClick={()=>{
                                dispatch(sendConnectionRequest({token: localStorage.getItem("token"),user_id: userProfile.userId._id}))
                                }}className={styles.connectBtn}>Connect
                                </button>
                                }
                                <div style={{cursor:"pointer"}} onClick={async ()=>{
                                    const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                                    window.open(`${BASE_URL}/${response.data.message}`, '_blank');
                                }}>
                                    <svg style={{width:"1.2em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                </div>
                            </div>
                            <div style={{paddingBlock:"1.2rem"}}>
                                {userProfile.bio}
                            </div>
                            
                            <div className={styles.workHistory}>
                                <h4>Work History</h4>
                                <div className={styles.workHistory_container}>
                                    {
                                    userProfile.pastWork?.map((work,index)=>{
                                        return(
                                            <div key={index} className={styles.workHistory_card}>
                                                <p style={{fontWeight:"bold", display:"flex", alignItems:"center",gap:"0.8rem"}}>{work.position} at {work.company}</p>
                                                <p>{work.years}</p>
                                            </div>
                                        )
                                    })
                                }
                                </div>

                            </div>
                            <div styles={{paddingInline:"1.2rem"}}>
                                <div className={styles.education}>
                                <h3>Education</h3>
                                <div className={styles.education_container}>
                                    {
                                    userProfile.education?.map((education,index)=>{
                                        return(
                                            <div key={index} className={styles.education_card}>
                                                <p>Degree: {education.degree} ({education.fieldOfStudy})</p>
                                                <p>School: {education.school}</p>
                                            </div>
                                        )
                                    })
                                }
                                </div>
                            </div>
                            </div>


                        </div>
                        <div style={{flex:"0.3",paddingInline:"1.2rem"}}>
                            <h3 style={{gap:"1.2rem"}}>Recent Activity</h3>
                            {userPosts.map((post)=>{
                                return(
                                    <div key={post._id} className={styles.postCard}>
                                        <div className={styles.card_profileContainer}>
                                            {post.media ? <img src={post.media} alt="Media"/>:<div style={{width:"3.4rem",height:"3.4rem"}}></div>}
                                        </div>

                                        <div>{post.body}</div>

                                    </div>
                                )
                            })}

                        </div>
                        

                    </div>
                    
                </div>
                
            </div>
        </DashBoardLayout>
    </UserLayout>
  )
}

export async function getServerSideProps(context) {
    try {
        const { username } = context.query;
        
        const request = await clientServer.get("/user/get_profile_base_on_username", {
            params: { username }
        });

        const profileData = request.data.Profile;
        if (!profileData) {
            return {
                props: { userProfile: null }
            };
        }

        return {
            props: {
                
                userProfile: JSON.parse(JSON.stringify(profileData))
            }
        };
    } catch (error) {
        console.error("Fetch error:", error);
        return {
            props: { userProfile: null }
        };
    }
}

