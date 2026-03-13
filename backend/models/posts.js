const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: String,
    content: String,
    username: String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    likeCount:{
        type:Number,
        default:0
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'comment'
    }],
    createdAt: {
        type:Date,
        default:Date.now
    },
})

const postModel = mongoose.model('post',postSchema);

module.exports = postModel;