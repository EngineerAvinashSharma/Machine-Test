const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userStatusSchema = new Schema({
  status:{
      type:String,
      enum:['active','blocked','deleted'],
      default:'active',
      required:true
  },
  user:{
      type:Schema.Types.ObjectId,
      ref:'User'
  },
  station:{
      type:Schema.Types.ObjectId,
      ref:'Station'
    }
},{timestamps:true});

module.exports = mongoose.model('UserStatus', userStatusSchema);
