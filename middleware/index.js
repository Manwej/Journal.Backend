const User =require('../models/user')
const Page =require('../models/journalpage')
const jwt=require('jsonwebtoken')


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
middlewareObj.getJournalPage =async (req,res, next)=>{
    try{
        journalpage = await Page.findById(req.params.id)
        if(journalpage==null){return res.status(404).json({message: "cannot find journalpage"})}
    }catch(err){
        return res.status(500).json({message:err.message})
    }
    res.journalpage=journalpage;
    next()
}
middlewareObj.checkAuthenticated=(req,res,next)=>{
    if (req.isAuthenticated()) {
        return next()
      }
    
      res.redirect('/login')
}
middlewareObj.checkNotAuthenticated=(req,res,next)=>{
    if (req.isAuthenticated()) {
        return res.redirect('/')
  }
  next()
}
middlewareObj.auth=(req,res,next)=>{
  const token = req.header('x-auth-token');

  // Check for token
  if (!token)
    return res.status(401).json({ msg: 'No token, authorizaton denied' });

  try {
    // Verify token
    const decoded = jwt.verify(token, "hello");
    // Add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
}


module.exports = middlewareObj;