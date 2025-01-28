import mongoose from "mongoose";


const userChatsSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    chats:[
        {
            _id: {
                type:String,
                //enum: ["user","model"],
                required: true,
            },
            title: {
                type:String,
                //enum: ["user","model"],
                required: true,
            },
            createdAt: {
                type:Date,
                default: Date.now(),
            },

        }
    ]
}, {timestamps: true}
)

export default mongoose.models.userchats || mongoose.model("userchats", userChatsSchema)