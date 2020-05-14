const mongoose =require('mongoose')


const journalPageSchema = new mongoose.Schema({
    author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username: String
    },
    date:{
        type: Date,
        default: Date.now
    },
    questions:["Name 3 things you are grateful for today.", 
    "Name 3 things that would make today perfect.", 
    "Write down your daily affirmation.", 
    "Name 3 awesome things you did today.", 
    "What could you have done better today?"],
    answer1: [{type: String}, {type: String}, {type: String}],
    answer2:  [{type: String}, {type: String}, {type: String}],
    affirmation: {type: String},
    answer4:  [{type: String}, {type: String}, {type: String}],
    answer5:  [{type: String}, {type: String}, {type: String}],
    
})
module.exports = mongoose.model('JournalPage', journalPageSchema)