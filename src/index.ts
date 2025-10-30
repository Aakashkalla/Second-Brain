import dotenv from 'dotenv'
dotenv.config();
import express from "express";
import { userRouter } from "./router/userRouter";
import mongoose, { mongo } from "mongoose";
const app = express();

app.use(express.json())

app.use('/api/v1/user', userRouter)

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URL!);
        console.log('DB CONNECTED')
    }catch(e){
        console.error(e)
    }
    app.listen(3000, ()=>{
    console.log("SERVER STARTED 3000")
    });
}
connectDB();