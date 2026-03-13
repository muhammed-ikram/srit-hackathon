const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/auth_cgpt`);

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password:String,
    role: {
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    createdAt: {
        type:Date,
        default:Date.now
    },
    posts: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'post'
        }
    ],
    profilepic: {
        type:String,
        default: "default.jpg"
    }
});

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;