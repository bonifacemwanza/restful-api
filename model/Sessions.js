const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const useSchema = new mongoose.Schema({

    user_id: {
        type: Schema.Types.ObjectId,
        min: 6,
        max: 255
    },
    user_token: {
        type: String,
        min: 6,
        max: 255
    }
})
module.exports = mongoose.model('Sessions', useSchema);