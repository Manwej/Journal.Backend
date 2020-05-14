const express = require('express')
const router = express.Router()
const Page=require('../models/journalpage')

const middleware=require('../middleware')

// get all pages
router.get('/:id/journalpage', async(req,res)=>{
    try{
        const pages = await Page.find()
        res.send(pages)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})
// getting one page
// router.get('/:id/journalpage', (req,res)=>{
//     //res.json(res.user)
// })


module.exports=router