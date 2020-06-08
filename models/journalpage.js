const mongoose =require('mongoose')


const journalPageSchema = new mongoose.Schema({
    date:{
        type: Date,
        default: Date.now
    },
    answer1: [{type: String}],
    answer2:  [{type: String}],
    affirmation: [{type: String}],
    answer4:  [{type: String}],
    answer5:  [{type: String}]
})
module.exports = mongoose.model('JournalPage', journalPageSchema)