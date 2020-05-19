const User =require('../models/user')
const Page =require('../models/journalpage')


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
    let getJournalPage
    try{
        journalpage = await Page.findById(req.params.id)
        if(journalpage==null){return res.status(404).json({message: "cannot find journalpage"})}
    }catch(err){
        return res.status(500).json({message:err.message})
    }
    res.journalpage=journalpage;
    next()
}

module.exports = middlewareObj;