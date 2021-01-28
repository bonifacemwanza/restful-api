const router = require('express').Router();
const multer = require('multer');
const shortid = require('shortid');
const User = require('../model/User');
const Sessions = require('../model/Sessions');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');
const Followers = require('../model/Followers');
const Followeds = require('../model/Followeds');
const Followtitle = require('../model/Followtitle');
const Watched = require('../model/Watched');
const jsonObj = require('../lib/cities.json');
var admin = require('firebase-admin');

const returnData = ({ cities: jsonObj });

var serviceAccount = require("../service.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://rubylive-a1f7d.firebaseio.com'
});
function findCityById(id) {
  return Object.entries(returnData.cities).reduce((a, [user, userData]) => {
    userData.id == id ? (a = userData) : "info";
    return a;
  }, {});
}


//console.log(findUserById(34));

const storage = multer.diskStorage({
  destination: (req, File, cb) => {
    cb(null, 'uploads/users/userprofile');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const imageFileFiler = (req, file, cb) => {
  if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
    return cb(new Error('you can upload only image files'));
  }
  cb(null, true);
};
const upload = multer({
  limits: {
    fileSize: 100000
  },
  storage: storage,
  fileFilter: imageFileFiler
});

router.post('/register', upload.single('imageFile'), async (req, res) => {
  // const {error} = registerValidation(req.body);
  // if(error) return res.status(400).send( res.send(error.details[0].message));


  //Check if user is alredy in database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email already exists');


  const random = Math.floor(Math.random() * 200001) + 1;

  // const checiid = findCityById(req.body.city);
  // const place = (checiid.name);

  //new user
  const user = new User({
    // name:req.body.name,
    email: req.body.email,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    biography: req.body.biography,
    phoneNumber: req.body.phoneNumber,
    uid: req.body.uid,
    city: req.body.city,
    birthdate: req.body.birthdate,
    unique_id: random,

    // password:HashedPassword
  });
  //SET THE INTIAL TABLE VALUE TO THE NEW REGISTERED USER
  const followers = new Followers({
    user_id: user._id
  });
  const followeds = new Followeds({
    user_id: user._id
  });
  const followtitle = new Followtitle({
    user_id: user._id
  });
  const watchm = new Watched({
    user_id: user._id
  });
  try {
    const saveUser = await user.save();
    //INIT MONGO TABLES 
    const followedsSave = await followeds.save();
    const followersSave = await followers.save();
    const followtitleSave = await followtitle.save();
    const watch = await watchm.save()
    res.send(user);

  } catch (err) {
    res.status(400).send(err);
  }

});
//LOGIN
router.post('/login', async (req, res) => {

  admin.auth().verifyIdToken(req.body.token)
    .then(function (decodedToken) {
      let uid = decodedToken.uid;
      if (uid == req.body.uid) {
        const user = User.findOne({ uid: uid });
        res.send(user);
      }
      else{
        res.send(false)
      }

    }).catch(function (error) {
      res.send(error);
    });


  const userToken = new Sessions({
    user_id: req.body.user_id,
    user_token: req.body.user_token,
  });
  const saveUser = await userToken.save();



});

router.get("/UserValidation/:uid", async (req, res) => {
  const userExist = await User.findOne({ uid: req.params.uid });
  if (userExist) { return res.status(200).send({ user: "true" }) }
  else {
    return res.status(400).send({ user: "false" });
  }
});
module.exports = router;