const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { BookingStatus } = require('./enums/BookingStatus.enum');
const { StationType } = require('./enums/StationType.enum');

const bookingSchema = new Schema({
    bookingType:{
        type:String,
        enum:['petrol','gas','diesel'],
        required:true
    },
    vehiclesType:{
        type:String,
        required:true
    },
    station:{
        type:Schema.Types.ObjectId,
        ref:'Station'
    },
    bookingBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    fillingBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    status:{
        type:String,
        default:'pending',
        enum:['pending','done','confirm']
    }
},{timestamps:true});


  module.exports = mongoose.model('Booking',bookingSchema);