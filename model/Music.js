const mongoose = require('mongoose');

// MUSIC SCHEMA
const musicSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    singer: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
});

const Music = module.exports = mongoose.model('Music', musicSchema);