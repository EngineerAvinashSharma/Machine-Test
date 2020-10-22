const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  role:{
      type: String,
      required: true,
      enum:['consumer','employee','stationIncharge'],
      default:'consumer'
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  imageUrl:{
      type: String
  },
  bookings: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Booking'
    }
  ]
},{timestamps:true});

module.exports = mongoose.model('User', userSchema);
