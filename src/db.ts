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
export const UserModel = model('Users', UserSchema)

const ContentSchema = new Schema({
    title : {
        type : String
    },
    link : String,
    tags : [{type : mongoose.Types.ObjectId, ref : 'Tag'}],
    userId : {
        type : mongoose.Types.ObjectId,
        ref : 'Users',
        required : true
    }
})

export const ContentModel = model('Content', ContentSchema);

const LinkSchema = new Schema({
    hash : {
        type : String
    },
    userId : {
        type : mongoose.Types.ObjectId,
        ref : 'Users',
        required : true,
        unique : true
    }
})

export const LinkModel = model('Links', LinkSchema)