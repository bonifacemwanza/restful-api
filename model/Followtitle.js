const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const useSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    followtitle_id: {
        type: Array
    }
});


module.exports = mongoose.model('Followtitle', useSchema);