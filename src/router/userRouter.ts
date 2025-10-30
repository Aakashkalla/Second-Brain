import { Router } from "express";
import jwt from "jsonwebtoken";
import {z} from 'zod'
import bcrypt from 'bcrypt'
import { ContentModel, UserModel } from '../db'
import { userMiddleware } from "../middleware";

export const userRouter = Router();

userRouter.post('/signup',async (req,res)=>{
    const requiredBody = z.object({
        email : z.email(),
        password : z.string().min(3).max(20),
        username: z.string().min(3).max(20)
    })

    const parsedBody = requiredBody.safeParse(req.body);

    if(!parsedBody.success){
        res.status(400).json({
            message : "Invalid Format!",
            error : parsedBody.error.issues
        });
        return;
    }

    const {email, password, username} = parsedBody.data;

    try{
        const hashedPassword = await bcrypt.hash(password,8)

        await UserModel.create({
            email : email,
            password : hashedPassword,
            username : username
        });

        res.status(201).json({
            message : "You have Successfull Signed Up"
        })
    }catch(e){
        res.status(409).json({
            message : "User Already Exists"
        });
        return
    }

})

userRouter.post('/signin',async(req,res)=>{
    const {email, password} = req.body

    try{
        if(!email || !password){
            res.status(400).json({
                message : "Email and Password are Required"
            });
            return;
        }

        const user = await UserModel.findOne({
            email,
        })

        if(!user || !user.password){
            res.status(401).json({
                message : "Invalid Username or Password"
            });
            return;
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if(!passwordMatch){
            res.status(401).json({
                message : "Invalid Username or Password"
            });
            return;
        }else{
            const token = jwt.sign({
                id : user._id
            }, process.env.JWT_SECRET!, { expiresIn: "1h" });
            res.status(200).json({
                token : token
            });
            return;
        } 

    }catch(e){
        console.error(e);
        res.status(500).json({
            message : "Server Error!"
        });
        return;
    }
})

userRouter.use(userMiddleware)
userRouter.post('/content',async (req,res)=>{
    const {link, title , tags} = req.body
    const userId = (req as any).userId; 
    if (!userId) {
        return res.status(403).json({ message: "Unauthorized" });
    }
    await ContentModel.create({
        title,
        link,
        tags,
        userId
    })
    res.status(200).json({
        message:"Content Added"
    })
})

userRouter.get('/content',(req,res)=>{

})

