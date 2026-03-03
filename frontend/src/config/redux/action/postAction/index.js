import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getAllPosts = createAsyncThunk(
    "post.getAllPosts",
    async(_,thunkAPI)=>{
        try{
            const response = await clientServer.get('/posts');

            // backend returns an object { posts: [...] }
            // return the posts array so reducers/components can map over it
            return thunkAPI.fulfillWithValue(response.data.posts);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const createPost = createAsyncThunk(
    "post/createPost",
    async (userData, thunkAPI)=>{
        const {file , body} = userData;

        try{
            const formData = new FormData();
            formData.append('token',localStorage.getItem('token'))
            formData.append('body',body)
            formData.append('media' ,file)

            const response = await clientServer.post("/post",formData,{
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(response.status === 200){
                return thunkAPI.fulfillWithValue("Post Uploaded")
            }else{
                return thunkAPI.rejectWithValue("Post not Uploaded")
            }
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const deletePost = createAsyncThunk(
    "post/deletePost",
    async(post_id , thunkAPI)=>{
        try{
            const response = await clientServer.delete("/delete_post",{
                data:{
                    token: localStorage.getItem("token"),
                    post_id: post_id.post_id
                }
            });
            return thunkAPI.fulfillWithValue(response.data)
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const incrementPostLike = createAsyncThunk(
    "post/incrementLike", 
    async({post_id} , thunkAPI)=>{
        try{
            const response = await clientServer.post("/increment_post_like",{
                post_id: post_id
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const getAllComments = createAsyncThunk(
    "post/getAllComments",
    async(postData , thunkAPI)=>{
        try{
            const postId = postData?._id || postData?.post_id || postData;
            const response = await clientServer.get("/get_comments",{
                params:{
                    post_id: postId
                }
            });
            return thunkAPI.fulfillWithValue({
                comments: response.data,
                post_id: postId
            })
        }catch(error){
        return thunkAPI.rejectWithValue(error.response.data);
    }
    }
)

export const postComment = createAsyncThunk(
    "post/postComment",
    async({post_id, body},thunkAPI)=>{
        try{
            const response = await clientServer.post("/comment",{
                token: localStorage.getItem("token"),
                post_id,
                commentBody: body
            });
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)