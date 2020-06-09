const mongoose =require('mongoose')


const journalPageSchema = new mongoose.Schema({
    date:{
        type: Date,
        default: Date.now
    },
    question1: {type: String},
    question2:  {type: String},
    question3: {type: String},
    question4:  {type: String},
    question5:  {type: String},
    question6:  {type: String}
})
module.exports = mongoose.model('JournalPage', journalPageSchema)