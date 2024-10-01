import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type:String, required:true},
    password: {type:String, required:true},
    role: {type:String, enum:["admin","employee"], required:true},
    createAt: {type:Date, default:Date.now},
    updatedAt: {type:Date, default:Date.now},
    
})

const User = mongoose.model("User", userSchema)
export default User