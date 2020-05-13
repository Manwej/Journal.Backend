const User =require('../models/user')

let middlewareObj ={}

 middlewareObj.getUser= async (req,res,next)=>{
    let user
    try{
        user = await User.findById(req.params.id)
        if (user==null){return res.status(404).json({message: "cannot find user"})}
    }catch(err){
        return res.status(500).json({message: err.message})
    }
    res.user=user;
    next()
}

module.exports = middlewareObj;