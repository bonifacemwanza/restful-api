const router = require('express').Router();
const multer = require('multer');
const Titles = require('../model/Titles');
const User = require('../model/User');
const verify  = require('./verifyToken');
const Objectid = require('mongodb').ObjectID;
const {userprofileValidation} = require('../validation');
const jsonObj = require("../lib/cities.json");
const Followers = require("../model/Followers");
const Followeds = require("../model/Followeds");

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

const returnData = { cities: jsonObj };
function findCityById(id) {
  return Object.entries(returnData.cities).reduce((a, [user, userData]) => {
    userData.id == id ? (a = userData) : "info";
    return a;
  }, {});
}

const storage = multer.diskStorage({
    destination: (req,File,cb) =>{
       cb(null,'public/uploads/users/userprofile');
    },
    filename: (req,file,cb) =>{
        cb(null, Date.now()+'-'+file.originalname);
    }
 });
 const imageFileFiler = (req, file, cb) => {
    if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
        return cb(new Error('you can upload only image files'));
    }
    cb(null, true);
};
const upload = multer({
    limits:{
        fileSize: 1000000
    },
    storage: storage,
    fileFilter: imageFileFiler
});
router.patch('/update/avatar',upload.single('imageFile'), async(req,res)=>{
     
    try {
           const updateUserD = await User.updateOne({ _id: req.body.id }, {$set: {avatar:req.file.path}});
            res.json(updateUserD);
       } catch(err){
           res.json({message: err});
    }
    
});
router.patch("/update/about", async (req, res) => {
  try {
    const updateUserD = await User.updateOne(
      { _id: req.body.id },
      { $set: { about: req.body.about } }
    );
    res.json(updateUserD);
  } catch (err) {
    res.json({ message: err });
  }
});
router.patch("/update/gender", async (req, res) => {
  try {
    const updateUserD = await User.updateOne(
      { _id: req.body.id },
      { $set: { gender: req.body.gender } }
    );
    res.json(updateUserD);
  } catch (err) {
    res.json({ message: err });
  }
});
router.patch("/update/name", async (req, res) => {
  try {
    const updateUserD = await User.updateOne(
      { _id: req.body.id },
      {
        $set: {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
        },
      }
    );
    res.json(updateUserD);
  } catch (err) {
    res.json({ message: err });
  }
});
router.patch("/update/birthdate", async (req, res) => {
  try {
    const updateUserD = await User.updateOne(
      { _id: req.body.id },
      {
        $set: {
          birthdate: req.body.birthdate,
        },
      }
    );
    res.json(updateUserD);
  } catch (err) {
    res.json({ message: err });
  }
});

router.patch("/update/email", async (req, res) => {
  try {
    const updateUserD = await User.updateOne(
      { _id: req.body.id },
      {
        $set: {
          email: req.body.email,
        },
      }
    );
    res.json(updateUserD);
  } catch (err) {
    res.json({ message: err });
  }
});
router.patch("/update/phonenumber", async (req, res) => {
  try {
    const updateUserD = await User.updateOne(
      { _id: req.body.id },
      {
        $set: {
          phoneNumber: req.body.phoneNumber,
        },
      }
    );
    res.json(updateUserD);
  } catch (err) {
    res.json({ message: err });
  }
});
router.patch("/update/country", async (req, res) => {
  try {
    const updateUserD = await User.updateOne(
      { _id: req.body.id },
      {
        $set: {
          country: req.body.country,
        },
      }
    );
    res.json(updateUserD);
  } catch (err) {
    res.json({ message: err });
  }
});
router.patch('/update/profile', async(req,res)=>{
     
    try {
            const updateData = {
                email:req.body.email,
                first_name:req.body.first_name,
                last_name:req.body.last_name,
                gender:req.body.gender,
                country:req.body.country,
                about:req.body.about


            };
 
           const updateUserD = await User.updateOne({ _id: req.body.id }, {$set: updateData});
            res.json(updateUserD);
       } catch(err){
           res.json({message: err});
    }
    
});
router.get('/get/:userId',async(req,res) =>{
    try {
    const userdata = await User.findById(req.params.userId);
       const gd  = await (userdata.gender);
       const dateofb =await (userdata.birthdate);
       const checiid = findCityById(userdata.city);
       const place =await (checiid.name);   
           const followers = await Followers.findOne({
             user_id: req.params.userId,
           }).exec();
           const followed = await Followeds.findOne({
             user_id: req.params.userId,
           }).exec();

        var followerData =await (followers.followers_id.length);
        var follewedData =await (followed.followed_id.length);
        var  age =await getAge(dateofb);
       
        

    const returnda =await {"profile": {"follower":followerData, "followed":follewedData, "unique_id":userdata.unique_id,"id":userdata._id,"posts":userdata.userPostedTitles.length, "avatar":userdata.avatar,"first_name":userdata.first_name,"country":userdata.country,"city":place, "language":userdata.language,"gender": gd, "about":userdata.about, "email":userdata.email, "last_name":userdata.last_name,"age": age, "birthdate": userdata.birthdate}} 
        res.json( returnda );
    }catch (err){
        res.json({message: err});

    }
})





module.exports = router;