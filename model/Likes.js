const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const useSchema = new mongoose.Schema({
    post_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    user_id: {
        type: Array
    }
});


module.exports = mongoose.model('Likes', useSchema);