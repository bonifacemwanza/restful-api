const router = require('express').Router();
const multer = require('multer');
const Watched = require('../model/Watched');


//Thi route posts saved videos
router.post('/saveWatchedVideo', async(req,res)=>{
 
    // const {error} = videoCommentValidation(req.body);
    // if(error) return res.status(400).send( res.send(error.details[0].message));
    
         const datas = new Watched({
                    user_id: req.body.user_id,
                    title_id: req.body.title_id,
        	        title: req.body.title,
        	        username:req.body.username,
        	        video_path: req.body.video_path,
        	        date: req.body.date
                });
    try{
          const watchedSave = await datas.save();
          res.send({watchedSave});
        }catch(err){
            res.status(400).send(err);
    }
    
});
//This route gets random vi
// router.get('/getrandom', async(req, res)=> {
    
//     try {
//         const Watched_videos = await Watched.findOne({ user_id: req.body.user_id }).exec();
//         const returnData = {'watched_videos' : Watched_videos};
//         res.json(Watched_videos);  
//     }  catch(err){
//         res.json({message:err});
//     }

// });
router.get('/getUserWatch/:user_id',async(req,res) =>{
    
    try {
    const post = await Watched.find({ user_id: req.params.user_id }).sort(
      { date: 1 },
      function (err, cursor) {}
    );
        res.json(post);
    }catch (err){
        res.json({message: err});

    }
})







module.exports = router;