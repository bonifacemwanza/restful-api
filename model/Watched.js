const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const useSchema = new mongoose.Schema({
    user_id: {
        type: String
       // required: true
    },
    title_id: {
        type: String
       // required: true
    },
    title: {
        type: String
        // required: true,
        
    },
    video_path: {
        type:String
        // required:true,
        
  
    },
     username: {
        type:String
        // required:true,
        
  
    },
     date: {
        type:String
        // required:true,
        
  
    }
});


module.exports = mongoose.model('Watched', useSchema);