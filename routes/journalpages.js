const express = require('express')
const router = express.Router()
const Page=require('../models/journalpage')
const User= require('../models/user')

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
router.get('/:id/journalpage/:id', middleware.getJournalPage, (req,res)=>{
    res.json(res.journalpage)
})
//Creating one Page
router.post('/:id/journalpage', async (req, res)=>{
    
    const page = new Page({
        //author: req.user.name,
        answer1: req.body.answer1,
        answer2:  req.body.answer2,
        affirmation: req.body.affirmation,
        answer4:  req.body.answer4,
        answer5:  req.body.answer5
    })
    try{
        const newPage = await page.save()
        res.status(201).json(newPage)
        console.log(req.user)
    }catch(err){
        res.status(400).json({message: err.message})
    }
})
//update journal page
router.patch('/:id/journalpage/:id', middleware.getJournalPage, async(req,res)=>{
    if(req.body.answer1 != null){
        req.journalpage.answer1= req.body.answer1
    }
    if(req.body.answer2 != null){
        req.journalpage.answer2= req.body.answer2
    }
    if(req.body.answer3 != null){
        req.journalpage.answer3= req.body.answer3
    }
    if(req.body.answer4 != null){
        req.journalpage.answer4= req.body.answer4
    }
    if(req.body.answer5 != null){
        req.journalpage.answer5= req.body.answer5
    }
    if(req.body.affirmation != null){
        req.journalpage.affirmation= req.body.affirmation
    }
    try{
        const updatePage = await res.journalpage.save();
        res.json(updatePage)
    }catch(err){
        res.status(400).json({message: err.message})
    }
} )

// DELETE ROute
router.delete('/:id/journalpage/:id', middleware.getJournalPage, async(req, res)=>{
    try{
        await res.user.remove()
        res.json({message: "user deleted"})
    }catch(err){
        res.status(500).json({message: err.message})
    }
})


module.exports=router