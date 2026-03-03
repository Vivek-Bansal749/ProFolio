import { createSlice } from "@reduxjs/toolkit"

import { getAllPosts, incrementPostLike ,getAllComments} from "../../action/postAction"




const initialState= {
    posts:[],
    isError:false,
    isSuccess:false,
    isLoading:false,
    loggedIn:false,
    message:"",
    comments:[],
    postId:"",
    postFetched:false
}

const postSlice = createSlice({
    name:"post",
    initialState,
    reducers:{
        reset: () => initialState,
        resetPostId:(state) =>{
            state.postId = ""
        },    
    },
    extraReducers:(builder) =>{
        builder
        .addCase(getAllPosts.pending,(state)=>{
            state.message = "Fetching all the Posts...";
            state.isLoading = true;
        })
        .addCase(getAllPosts.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.postFetched = true;
            state.posts = action.payload.reverse();
        })
        .addCase(getAllPosts.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(incrementPostLike.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.message = "Like Added";
        })
        .addCase(incrementPostLike.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getAllComments.fulfilled,(state,action)=>{
            state.postId = action.payload.post_id
            state.comments = action.payload.comments;
        })
    }
})


export const {resetPostId} = postSlice.actions;

export default postSlice.reducer;