import mongoose from "mongoose";


const UserSchem = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        type: String,
        required: true,
        unique:true,
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    active:{
        type: String,
        default: true,
    },
    password:{
        type: String,
        required: true,
    },
    profilePicture:{
        type : String,
        default: "https://res.cloudinary.com/ddwqdl5eg/image/upload/v1772537963/linkedin-clone/profile-pictures/mnatrenmkfm3txxsf56u.png",
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    token:{
        type: String,
        default:'',
    },

})

const User = mongoose.model("User",UserSchem);
export default User;