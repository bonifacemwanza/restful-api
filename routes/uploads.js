const router = require('express').Router();
const multer = require('multer');



const storage = multer.diskStorage({
   destination: (req,File,cb) =>{
      cb(null,'uploads/videos');
   },
   filename: (req,file,cb) =>{
       cb(null, Date.now()+'-'+file.originalname);
   }
});



const imageFileFiler = (req, file, cb) => {
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
    fileFilter: imageFileFiler
});

router.post('/uploads', upload.single('videoFile'),(req,res)=>{
   res.statusCode = 200;
   res.setHeader('Content-Type', 'application/json');
   res.json(req.file);
 });

module.exports = router;