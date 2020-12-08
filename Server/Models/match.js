//Benyttes ikke i programmet, men er med til eventuel videreudvikling

/*
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    senderSent: {
        type: Boolean,
        default: false
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    receiverReceived: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.export = mongoose.model('Match', matchSchema);
*/