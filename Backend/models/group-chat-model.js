const mongoose =require('mongoose');

const groupChatSchema = new mongoose.Schema({
    groupName:{
        type:String,
        default:"",
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee",
        default:[]
    }],
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee",
        default:""
    },
    createdAt:{
        type:Date,
        default:Date.now
    },

})

module.exports=mongoose.model("GroupChat",groupChatSchema);