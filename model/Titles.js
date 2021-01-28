const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const useSchema = new mongoose.Schema({
    id: {
        type: Number,
        autoIncrement: true,
        primaryKey: true
    },
    title_id: {
        type: String

    },
    post_like_user_id: {
        type: Array
    },
    post_user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        // required: true,
        min: 6,
        max: 255
    },
    video: {
        type:String,
        // required:true,
        
  
    },
    video_path: {
        type:String,
        // required:true,
        
  
    },
     username: {
        type:String,
        // required:true,
        
  
    },
    comment: {
        type:Array,
        // required:true,
        
  
    },
    
    

    description: {
        type:String,
        // required:true,
        min: 6,
        max: 500
    },
    date: {
        type: Date,
        default: Date.now
    },
    // tag: { 
    //     type: varchar,
    //     required: true

    // },
    // last_trend_time: {
    //     type: Int,
    //     required: true,
    //     default: 0
    // },
    // trend_use_num: {
    //     type: Int,
    //     required: true,
    //     default: 0
    // },
    // expire: {
    //     type: Date

    // }


});


module.exports = mongoose.model('Titles', useSchema);