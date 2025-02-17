import express from "express"
import ImageKit from "imagekit";
import cors from "cors";
import mongoose from "mongoose";
import Chat from "./models/chat.js"
import UserChats from "./models/userChats.js";
import { requireAuth } from '@clerk/express';
import dotenv from "dotenv";
import path from "path";
import url, { fileURLToPath } from "url"
dotenv.config();



const port = process.env.PORT || 3000;

const app = express();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(
    cors({
    origin: "ai-chat-three-omega.vercel.app",
    credentials : true,
}))

app.use(express.json())

const connect = async() =>{
    try{
        await mongoose.connect("mongodb+srv://goodcupcakes344:WBMmWkTD6crRqT4I@cluster0.1iyvp.mongodb.net/aichat?retryWrites=true&w=majority&appName=Cluster0")
        console.log("Connected to MongoDB")
        const publishableKey = "pk_test_Y2hpZWYtbW90aC01MS5jbGVyay5hY2NvdW50cy5kZXYk";
console.log("Publishable Key:", publishableKey);

    }catch(err){
        console.log(err)
    }
}
const imagekit = new ImageKit({
    urlEndpoint: "https://ik.imagekit.io/f7oddq0fs",
    publicKey:  "public_YvW3d2/TM7G946vBAsLPGoS64P4=",
    privateKey:  "private_KG7mrrhNmTOz4/20oldvaEGIcwc=",
  });

  
app.get("/api/upload",(req,res)=>{
    const  result = imagekit.getAuthenticationParameters();
    res.send(result)
})

// app.get("/api/test",requireAuth(),(req,res)=>{
//     const userId = req.auth.userId;
//     console.log(userId)
//     res.send("Success!")
// })
app.post("/api/chats", requireAuth(),
   async (req,res)=>{
    const userId = req.auth.userId;
    const {text} = req.body
    
    try{
        //CREATE A NEW CHAT
        const newChat= new Chat ({
            userId:userId,
            history:[{role: "user", parts: [{text}]}]
        })

        const savedChat = await newChat.save()

        //CHECK IF THE USERCHATS EXITS

        const userChats = await UserChats.find({userId:userId})
        //IF DOESNT EXIST CREATE A NEW ONE AND ADD THE CHAT IN THE CHATS ARRAY
        if(!userChats.length){
            const newUserChats = new UserChats ({
                userId:userId,
                chats:[
                    {
                        _id:savedChat._id,
                        title: text.substring(0,40)
                            
                        
                    }
                ]
            })
            await newUserChats.save()

        } else{
            //IF EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
            await UserChats.updateOne({userId:userId}, {
                $push: {
                    chats: {
                        _id:savedChat._id,
                        title: text.substring(0,40)
                    }
                }
            })

            res.status(201).send(newChat._id)
        }
    } catch(err){
        console.log(err)
        res.status(500).send("Error creating chat!")
    }
})

app.get("/api/userchats",requireAuth(), async(req,res)=>{
    const userId = req.auth.userId;

    try{
        const userChats = await UserChats.find({userId})
        if (!userChats.length || !userChats[0]?.chats) {
            return res.status(200).send([]); 
        }
        
        res.status(200).send(userChats[0].chats)
    }catch(err){
        console.log(err)
        res.status(500).send("Error fetching userchats!")

    }
})

app.get("/api/chats/:id",requireAuth(), async(req,res)=>{
    const userId = req.auth.userId;

    try{
        const chat = await Chat.findOne({_id: req.params.id, userId})
        res.status(200).send(chat)
    }catch(err){
        console.log(err)
        res.status(500).send("Error fetching chat!")

    }
})

app.put("/api/chats/:id", requireAuth(), async(req,res)=>{
    const userId = req.auth.userId
    const {question, answer,img} = req.body;

    const newItems = [
    ... (question ? [{role : "user", parts: [{text :question}], ...(img && {img})}]: []),
        {role:"model",parts :[{text:answer}]},
    ]
    try{
        const updatedChat = await Chat.updateOne({_id: req.params.id, userId},{
            $push:{
                history:{
                $each:newItems,
                }
            }
        })
        res.status(200).send(updatedChat)
    }catch(err){
        console.log(err)
        res.status(500).send("Error adding conversation!")

    }

})
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(401).send('Unauthenticated!')
  })

app.use(express.static(path.join(__dirname,"../client")))
  

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../client","index.html"))
})

app.listen(port,()=>{
    connect()
    console.log("Server running on 3000")
})