const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const useSchema = new mongoose.Schema({
    id: {
        type: Number,
        autoIncrement: true,
        primaryKey: true
    },
    titles_id: {
        type: Schema.Types.ObjectId

    },
    post_user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    username:{
        type: String
    },
    comment: {
        type: String,
        // required: true
    },
    video: {
        type:String,
        // required:true,
        
  
    },
    video_path: {
        type:String,
        // required:true,
        
  
    },
    type: {
        type:String,
        // required:true,
        
  
    },
    date: {
        type: Date,
        default: Date.now
    }

});


module.exports = mongoose.model('Comment', useSchema);