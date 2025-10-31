import { Router } from "express";
import { userMiddleware } from "../middleware";
import { LinkModel } from "../db";
import { random } from "../utils";

export const brainRouter = Router();

brainRouter.use(userMiddleware);

brainRouter.post('/share', userMiddleware,async (req,res)=>{
    const {share} = req.body;
    const userId = (req as any).userId
    if(share){
        await LinkModel.create({
            hash : random(10),
            userId
        })
    }else{
        await LinkModel.deleteOne({
            userId
        })
    }

    res.json({
        message: "Updated Sharable Link"
    })
})

brainRouter.get('/:shareLink', () => {
    
})

