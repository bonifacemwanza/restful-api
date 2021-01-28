const router = require('express').Router();
const multer = require('multer');
const Likes = require('../model/Likes');
const Titles = require('../model/Titles');

const verify = require('./verifyToken');
const {commentValidation,videoCommentValidation} = require('../validation');

 
router.post('/like', async(req,res)=>{
    var query = {_id: req.body.post_id},
    update = { $push: { post_like_user_id: [ req.body.post_like_user_id ], }},
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

    // Find the document
    Titles.findOneAndUpdate(query, update, options, function(error, result) {
    if (error) return;

    res.json({message: 'Success'})
});
    
});

router.post('/unlike', async(req,res)=>{
    
    try {        
       const dislike = await Titles.updateOne({ _id: req.body.post_id }, {$pull: {post_like_user_id: req.body.post_like_user_id} });
        res.json(dislike);
    } catch(err){
        res.json({message: err});
        }
    
});

router.get('/like/get', async(req, res)=> {
    try{
        const likes = await Titles.findOne({ _id: req.body.post_id }).exec();
        const returnData = {'Likes' : likes.post_like_user_id.length};
        res.json(returnData);    
    }catch(err){
        res.json(err);
    }
})


module.exports = router;