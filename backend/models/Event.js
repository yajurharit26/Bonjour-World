const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// function formatDate(date) {
//     var d = new Date(date),
//         month = '' + (d.getMonth() + 1),
//         day = '' + d.getDate(),
//         year = d.getFullYear();

//     if (month.length < 2) 
//         month = '0' + month;
//     if (day.length < 2) 
//         day = '0' + day;

//     return [year, month, day].join('-');
// }

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    languages: [{
        type: String,
        required: true
    }],
    address: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    host: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }],
    pendingAttendees: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema)
