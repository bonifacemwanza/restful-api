const router = require('express').Router();
const multer = require('multer');
const Titles = require('../model/Titles');
const User = require('../model/User');
const Comment = require('../model/Comment');
const verify = require('./verifyToken');
const Followtitle = require('../model/Followtitle');
const Likes = require('../model/Likes');
const { titlesValidation } = require('../validation');
const Watched = require('../model/Watched');
const {ObjectId} = require('mongodb'); 

// router.get('/', (req,res)=>{
//     res.json({posts:{title: 'testing post', description: 'kaiyeni uko'}});
// });
const storage = multer.diskStorage({
    destination: (req, File, cb) => {
        cb(null, 'public/uploads/videos');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const videoFileFiler = (req, file, cb) => {
    if (!file.originalname.match(/\.(mp4|mov)$/)) {
        return cb(new Error('you can upload only mp4 and mov files'));
    }
    cb(null, true);
};
const upload = multer({
    limits: {
        fileSize: 100000000
    },
    storage: storage,
    fileFilter: videoFileFiler
});

router.post('/titles',upload.single('videoFile'), async (req, res) => {

    // const { error } = titlesValidation(req.body);
    // if (error) return res.status(400).send(res.send(error.details[0].message));

    const titleExists = await Titles.findOne({ title: req.body.title });
    if (titleExists) return res.status(400).send('Title already exists');

    const titles = new Titles({
        post_user_id: req.body.post_user_id,
        title: req.body.title,
        username:req.body.username,
        video_path: req.file.path


    });

    try {
        const saveTitle = await titles.save();
        var query = {_id: req.body.post_user_id},
        update = { $push: { userPostedTitles: [ req.body.post_user_id ], }},
        options = { upsert: true, new: true, setDefaultsOnInsert: true , useUnifiedTopology: true,useFindAndModify: false };
        User.findOneAndUpdate(query, update, options, function(error, result) {})
        res.send({ saveTitle });
    } catch (err) {
        res.status(400).send(err);
    }

});
router.post('/titlesExists', upload.single('videoFile'), async (req, res) => {


    const titles = new Titles({
        post_user_id: req.body.post_user_id,
        title_id: req.body.title_id,
        description: req.body.description,
        video: req.file.filename,
        video_path: req.file.path

    });
    try {
        const saveTitle = await titles.save();
        res.send({ saveTitle });
    } catch (err) {
        res.status(400).send(err);
    }

});
router.get('/getFollowedUsersPosts/:user_id',async(req,res) =>{
    const userID = req.params.user_id;
    
    try {
            const posts = await Titles.aggregate([
            {
                $lookup:
                    {
                        from: "followers",
                        localField: "userID",
                        foreignField: "following",
                        as: "relationship"
                    }
            },
            { "$match": { "relationship.0.userID": ObjectId()} }
        ]);


res.send({posts});
    }catch (err){
        res.json({message: err});

    }
})

router.get('/getTilePosts/:titles_id',async(req,res) =>{
    
    try {
    const post = await Titles.find({ titles_id: req.params.titles_id }).sort(
      { date: 1 },
      function (err, cursor) {}
    );
        res.json(post);
    }catch (err){
        res.json({message: err});

    }
})
router.get('/getUsersTitles/:userId',async(req,res) =>{
   try {
        const usd = req.params.userId;
        const promise = Titles.aggregate([
            {
                 $lookup: {
                 
                     from: 'comments',
                     localField: '_id',
                     foreignField: 'titles_id',
                     as: 'titles'
                 }
             },
             
             {
               
                   $match:{'post_user_id': ObjectId(usd)} 
                   
             },

      
         
         
            {
                $project: {
                    title: '$title',
                    post_user_id: '$post_user_id',
                    username: '$username',
                    video: '$video_path',
                    date: '$date',
                    comments:  { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "0"}},

                    videos: { $size: "$titles" },
                    likes: { $cond: { if: { $isArray: "$post_like_user_id" }, then: { $size: "$post_like_user_id" }, else: "0"}}
                }

            },

                
            { $sort: { date: -1 } }
        ]);

        promise.then(async (data) => {

            const Watched_videos = await Watched.updateOne({ user_id: usd }, { $push: { watched_post_id: [data] } });

           
            res.json(data);
        }).catch((err) => {
            res.json(err);
        });
    } catch (err) {
        res.json({ message: err });
    }
});


router.get('/getTitles', async (req, res) => {
    try {
        const usd = req.body.user_id;
        const promise = Titles.aggregate([

             {
                 $lookup: {
                 
                     from: 'comments',
                     localField: '_id',
                     foreignField: 'titles_id',
                     as: 'titles'
                 }
             },
         
            {
                $project: {
                    title: '$title',
                    post_user_id: '$post_user_id',
                    username: '$username',
                    video: '$video_path',
                    date: '$date',
                    comments:  { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "0"}},

                    videos: { $size: "$titles" },
                    likes: { $cond: { if: { $isArray: "$post_like_user_id" }, then: { $size: "$post_like_user_id" }, else: "0"}}
                }

            },
            { $sort: { date: -1 } }
        ]);

        promise.then(async (data) => {

           // const Watched_videos = await Watched.updateOne({ user_id: usd }, { $push: { watched_post_id: [data] } });

           
            res.json(data);
        }).catch((err) => {
            res.json(err);
        });
    } catch (err) {
        res.json({ message: err });
    }
});

router.get('/gettitlesCounts', async (req, res) => {
      try {
        const usd = req.body.user_id;
        const promise = Titles.aggregate([

             {
                 $lookup: {
                 
                     from: 'comments',
                     localField: '_id',
                     foreignField: 'titles_id',
                     as: 'titles'
                 }
             },
         
            {
                $project: {
                    title: '$title',                   
                    videos: { $size: "$titles" },
                   
                }

            },
            { $sort: { date: -1 } }
        ]);

        promise.then(async (data) => {

           // const Watched_videos = await Watched.updateOne({ user_id: usd }, { $push: { watched_post_id: [data] } });

           
            res.json(data);
        }).catch((err) => {
            res.json(err);
        });
    } catch (err) {
        res.json({ message: err });
    }
 });

module.exports = router;