const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    content:String,
    status:{
        type:String,
        enum:['visible','hidden'],
        default:'visible'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const commentModel = mongoose.model('comment',commentSchema);

module.exports = commentModel;