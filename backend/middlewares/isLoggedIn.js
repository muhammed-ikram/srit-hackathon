const jwt = require("jsonwebtoken");

function isLoggedIn(req,res,next){
    
    const token = req.cookies.token;
    
    if(!token){
        return res.status(401).json({ message: "Unauthorized" });
    }
    try{
        const data = jwt.verify(token,"secretkey");
        req.user = data;
        next();
    }
    catch(err){
        res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = isLoggedIn;