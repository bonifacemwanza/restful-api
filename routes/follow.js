const router = require('express').Router();
const multer = require('multer');
const Followers = require('../model/Followers');
const Followeds = require('../model/Followeds');
const Followtitle = require('../model/Followtitle');
const Watched = require('../model/Watched');

const verify = require('./verifyToken');
const {commentValidation,videoCommentValidation} = require('../validation');

 
router.post('/follow', async(req,res)=>{
    
    
    try {
        const followers = {
            followers_id:  [ req.body.followers_id ],
        }
        const followed = {
            followed_id:  [ req.body.user_id ],
        }
        
       const updateFollowers = await Followers.updateOne({ user_id: req.body.user_id }, {$push: followers});
       const updateFollowed = await Followeds.updateOne({ user_id: req.body.followers_id }, {$push: followed});

        res.json(updateFollowers);
    } catch(err){
        res.json({message: err});
    }
    
});

router.post('/unfollow', async(req,res)=>{
    
    try {        
       const unfollow = await Followers.updateOne({ user_id: req.body.user_id }, {$pull: {followers_id: req.body.followers_id} });
       const unfollowed = await Followeds.updateOne({ user_id: req.body.followers_id }, {$pull: {followed_id: req.body.user_id} });
        res.json(unfollowed);
    } catch(err){
        res.json({message: err});
        }
    
});
router.post('/unfollowtitle', async(req,res)=>{
    
    try {        
       const unfollow = await Followtitle.updateOne({ user_id: req.body.user_id }, {$pull: {followtitle_id: req.body.followtitle_id} });
        res.json(unfollowed);
    } catch(err){
        res.json({message: err});
        }
    
});
router.post('/followtitle', async(req,res)=>{
    
    
    try {
        
  
        const followtitle = {
            followtitle_id:  [ req.body.followtitle_id ],
        }

       const Watched_videos  = await Watched.updateOne({ user_id: req.body.user_id }, {$push: { watched_post_id:  [ req.body.followtitle_id ]}});
       const updateFollowed = await Followtitle.updateOne({ user_id: req.body.user_id }, {$push: followtitle});
    console.log(Watched_videos);
        res.json(updateFollowed);
    } catch(err){
        res.json({message: err});
        }
    
});

router.get('/follow/get', async(req, res)=> {
    
    const followers = await Followers.findOne({ user_id: req.body.user_id }).exec();
    const followed = await Followeds.findOne({ user_id: req.body.user_id }).exec();
    const returnData = {'Follower' : followers.followers_id.length, 'Followed': followed.followed_id.length};
    res.json(returnData);    
})
router.get('/follow/gettitles', async(req, res)=> {
    
    //const foll = await Followers.findOne({ user_id: req.body.user_id }).exec();
    const followed = await Followtitle.findOne({ user_id: req.body.user_id }).exec();
    const returnData = {'followed_titles' : followed};
    res.json(returnData);    
})


module.exports = router;