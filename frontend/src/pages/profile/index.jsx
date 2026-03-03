import UserLayout from '@/layout/UserLayout'
import React, { use, useEffect,useState } from 'react'
import DashBoardLayout from '@/layout/DashBoardLayout'
import { getAboutUser } from '@/config/redux/action/authAction'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL, clientServer } from '@/config'
import styles from "./index.module.css"

import { getAllPosts } from '@/config/redux/action/postAction'
import { resetPostId } from '@/config/redux/reducer/postReducer'


export default function Profile() {


    const authState = useSelector((state)=>state.auth);

    const [userProfile, setUserProfile] = useState({});

    const [userPosts, setUserPosts] = useState([]);

    const postReducer = useSelector((state)=>state.postReducer);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isEduModalOpen, setIsEduModalOpen] = useState(false);

    const [inputData, setInputData] = useState({
        company:"",
        position:"",
        years:""
    });

    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputData({...inputData, [name]: value });
    };


    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(getAboutUser({token: localStorage.getItem("token")}));
        dispatch(getAllPosts());
    },[])

    useEffect(()=>{
        

        if(authState.user != undefined){
            setUserProfile(authState.user);
            const filtered = postReducer.posts?.filter((p)=>{
                return p.userId?.username === authState.user.userId.username;
            });
            setUserPosts(filtered);
        }
            
    },[authState.user,postReducer.posts])

    const updateProfilePicture = async (file)=>{
        const formData = new FormData();
        // must match backend: uploadCloud.single('profile_picture')
        formData.append("profile_picture", file);
        formData.append("token", localStorage.getItem("token"));

        await clientServer.post("/update_profile_picture", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        
        dispatch(getAboutUser({token: localStorage.getItem("token")}));
    }


    const updateProfileData = async()=>{
        const request = await clientServer.post("/user_update", {
            token: localStorage.getItem("token"),
            name: userProfile.userId?.name
        });
        const response = await clientServer.post("/update_profile_data",{
            token: localStorage.getItem("token"),
            bio: userProfile.bio,
            pastWork: userProfile.pastWork,
            education: userProfile.education,
            currentPost: userProfile.currentPost
        })

        dispatch(getAboutUser({token: localStorage.getItem("token")}));
    }

  return (
    <UserLayout>
        <DashBoardLayout>
            {authState.user && userProfile.userId &&
            <div className={styles.container}>
                <div className={styles.backDropContainer}>
                    <label htmlFor="profilePictureUpload" className={styles.backDrop_overlay}>
                        <p>Edit</p>
                    </label>
                    <input hidden type="file" id="profilePictureUpload" onChange={(e)=>{
                        const file = e.target.files?.[0];
                        if (!file) return;
                        updateProfilePicture(file);
                        e.target.value = "";
                    }}/>
                    <img
                        src={userProfile.userId.profilePicture}
                        alt="Profile"
                    />
                </div>

                <div className={styles.profile_container_details}>
                    <div style={ {display:"flex",flexDirection:"row",gap:"2rem"} }>
                        <div>

                            <div style={{display:"flex",flexDirection:"column",width:"fit-content"}}>
                                <input className={styles.nameEdit} type="text" value={userProfile.userId.name} onChange={(e)=>{
                                    setUserProfile({...userProfile, userId:{...userProfile.userId, name:e.target.value}})
                                }}/>
                                <p style={{color:"grey"}}>@{userProfile.userId.username}</p>
                            </div>
                        
                            <div style={{paddingBlock:"1.2rem"}}>
                                <textarea name="bio" id="bio" value={userProfile.bio} onChange={(e)=>{
                                    setUserProfile({...userProfile, bio:e.target.value})
                                }}
                                rows={Math.max(3, Math.ceil(userProfile.bio.length/ 80))}
                                style={{width:"100%", padding:"0.5rem",outline:"none"}}/>
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
                                <button onClick={()=>{
                                    setIsModalOpen(true)
                                }} className={styles.addWorkBtn}>Add Work</button>
                                </div>
                                

                            </div>
                            <div style={{marginTop:"1.4rem"}} className={styles.education}>
                                <h3>Education</h3>
                                <div className={styles.education_container}>
                                    {
                                    userProfile.education?.map((education,index)=>{
                                        return(
                                            <div key={index} className={styles.education_card}>
                                                <p style={{fontWeight:"bold", display:"flex", alignItems:"center",gap:"0.8rem"}}>Degree: {education.degree}  ({education.fieldOfStudy})</p>
                                                <p style={{fontWeight:"bold", display:"flex", alignItems:"center",gap:"0.8rem"}}>High School : {education.school}</p>
                                                
                                            </div>
                                        )
                                    })
                                }
                                <button onClick={()=>{
                                    setIsEduModalOpen(true)
                                }} className={styles.addEduBtn}>Add Education</button>
                                </div>

                            </div>


                        </div>
                        

                    </div>
                    <div>
                            <h3>Recent Activity</h3>
                            {userPosts.map((post)=>{
                                return(
                                    <div key={post._id} className={styles.postCard}>
                                        <div className={styles.card_profileContainer}>
                                            {post.media !=="" ? <img src={post.media} alt="Media"/>:<div style={{width:"3.4rem",height:"3.4rem"}}></div>}
                                        </div>

                                        <div>{post.body}</div>

                                    </div>
                                )
                            })}

                        </div>
                    
                </div>
                {userProfile != authState.user && <div onClick={()=>{
                    updateProfileData()
                    }} className={styles.updateProfileBtn}>
                    Update Profile</div>
                }
                
            </div>
        }
        {
                        isModalOpen &&
                        <div onClick={
                            ()=>{
                                setIsModalOpen(false);
                            }
                        } className={styles.commentContainer}>
                            <div onClick={(e)=>{
                                e.stopPropagation()
                            }} className={styles.allCommentContainer}>
                                <input onChange={handleInputChange} name="company" className={styles.inputField}  type="text" placeholder='Enter Company Name' />
                                <input onChange={handleInputChange} name="position" className={styles.inputField}  type="text" placeholder='Enter Position' />
                                <input onChange={handleInputChange} name="years" className={styles.inputField}  type="number" placeholder='Years of Experience' />
                                <div onClick={()=>{
                                    setUserProfile({...userProfile, pastWork:[...userProfile.pastWork, inputData]})
                                    setIsModalOpen(false)
                                }} className={styles.updateProfileBtn}>
                                    Add Work

                                </div>
                            </div>
                        </div>

                    }
                    {
                        isEduModalOpen &&
                        <div onClick={
                            ()=>{
                                setIsEduModalOpen(false);
                            }
                        } className={styles.commentContainer}>
                            <div onClick={(e)=>{
                                e.stopPropagation()
                            }} className={styles.allCommentContainer}>
                                <input onChange={handleInputChange} name="school" className={styles.inputField}  type="text" placeholder='Enter School Name' />
                                <input onChange={handleInputChange} name="degree" className={styles.inputField}  type="text" placeholder='Enter Degree' />
                                <input onChange={handleInputChange} name="fieldOfStudy" className={styles.inputField}  type="text" placeholder='Enter Field of Study' />
                                
                                <div onClick={()=>{
                                    setUserProfile({...userProfile, education:[...userProfile.education, inputData]})
                                    setIsEduModalOpen(false)
                                }} className={styles.updateProfileBtn}>
                                    Add Education

                                </div>
                            </div>
                        </div>
                    }
        </DashBoardLayout>
    </UserLayout>
  )
}
