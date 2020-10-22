const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StationType = require('./enums/StationType.enum');

const stationSchema = new Schema({
    name: {
        type: String,
        unique:true,
        required: true,
    },
    stationType: {
        type: String,
        enum: ['petrol','gas','diesel'],
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    bookings: [
        {
         type:Schema.Types.ObjectId,
         ref:'Booking'
        }
    ]
});


module.exports = mongoose.model('Station', stationSchema);