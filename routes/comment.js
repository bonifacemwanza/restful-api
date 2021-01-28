const router = require('express').Router();
const multer = require('multer');
const Comment = require('../model/Comment');
const Titles = require('../model/Titles');
const User = require('../model/User');
const verify = require('./verifyToken');
const {commentValidation,videoCommentValidation} = require('../validation');


const storage = multer.diskStorage({
    destination: (req,File,cb) =>{
       cb(null,'public/uploads/videos');
    },
    filename: (req,file,cb) =>{
        cb(null, Date.now()+'-'+file.originalname);
    }
 });
 const videoFileFiler = (req, file, cb) => {
    if(!file.originalname.match(/\.(mp4|mov)$/)){
        return cb(new Error('you can upload only mp4 and mov files'));
    }
    cb(null, true);
};
const upload = multer({
    limits:{
        fileSize: 100000000
    },
    storage: storage,
    fileFilter: videoFileFiler
});
 
router.post('/comment', async(req,res)=>{
 
    // const {error} = commentValidation(req.body);
    // if(error) return res.status(400).send( res.send(error.details[0].message));
    
    
    const comment = new Comment({
        titles_id:req.body.titles_id,
        username:req.body.username,
        post_user_id:req.body.post_user_id,
        comment:req.body.comment,
        type:"text"
     
    });
    try{  


        const commentSave = await comment.save();
       var query = {_id: req.body.titles_id},
        update = { $push: { comment: [ req.body.post_user_id ], }},
        options = { upsert: true, new: true, setDefaultsOnInsert: true };
        Titles.findOneAndUpdate(query, update, options, function(error, result) {  if (error) return;

    res.json({message: 'Success'})});
          // res.send({commentSave});
        }catch(err){
            res.status(400).send(err);
    }
    
});
router.post('/videocomment',upload.single('videoFile'), async(req,res)=>{
 
    // const {error} = videoCommentValidation(req.body);
    // if(error) return res.status(400).send( res.send(error.details[0].message));
    
    
    const comment = new Comment({
        titles_id:req.body.titles_id,
        username:req.body.username,
        post_user_id:req.body.post_user_id,
        video:req.file.filename,
        video_path:req.file.path,
        type:"video"
     
    });
    try{
          const commentSave = await comment.save();
          res.send({commentSave});
        }catch(err){
            res.status(400).send(err);
    }
    
});

router.get('/getcomments', (req, res) => {
    const promise = Comment.aggregate([
        {
            $lookup: {
                from: 'Comment',
                localField: 'post_user_id',
                foreignField: '_id',
                as: 'user'
            }
        },
            {
                $unwind: '$comment'
            }
    ]);
    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

router.get('/getTextComment/:titles_id',async(req,res) =>{
    
    try {
    const post = await Comment.find({titles_id: req.params.titles_id, type:"text"});
        res.json(post);
    }catch (err){
        res.json({message: err});

    }
})

router.get('/getspecific/:titles_id',async(req,res) =>{
    
    try {
    const post = await Comment.find({ titles_id: req.params.titles_id });
        res.json(post);
    }catch (err){
        res.json({message: err});

    }
})
router.get('/get/:titles_id',async(req,res) =>{
    
    try {
    const post = await Comment.find({ titles_id: req.params.titles_id }).sort(
      { date: 1 },
      function (err, cursor) {}
    );
        res.json(post);
    }catch (err){
        res.json({message: err});

    }
})

module.exports = router;