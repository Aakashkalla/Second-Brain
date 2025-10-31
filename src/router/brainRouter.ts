import { Router } from "express";
import { userMiddleware } from "../middleware";
import { ContentModel, LinkModel, UserModel } from "../db";
import { random } from "../utils";

export const brainRouter = Router();

brainRouter.get('/:shareLink', async (req,res) => {
    const hash = req.params.shareLink

    const link = await LinkModel.findOne({
        hash 
    });

    if(!link){
        res.status(411).json({
            message : "Sorry! Incorrect Input"
        })
        return;
    }

    const content = await ContentModel.find({
        userId : link.userId
    })

    const user = await UserModel.findOne({
        _id : link.userId
    })

    if(!user){
        res.status(500).json({
            message : "Unexpected Error! USER NOT FOUND"
        })
        return;
    }

    res.json({
        username : user.username,
        content : `Your Content ${content}`
    })

})

brainRouter.use(userMiddleware);

brainRouter.post('/share', userMiddleware,async (req,res)=>{
    const {share} = req.body;
    const userId = (req as any).userId
    if(share){
        const existingLink = await LinkModel.findOne({
            userId
        })
        if(existingLink){
            res.json({
                hash : existingLink.hash
            })
            return;
        }
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

