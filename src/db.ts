import mongoose, { model,Schema } from "mongoose";

const UserSchema = new Schema({
    email : {
        type : String,
        unique : true
    },
    password : String,
    username : {
        type : String, 
        unique : true
    }
})

export const UserModel = mongoose.model('Users', UserSchema)