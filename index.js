const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


//Import Routes
const authRoute = require('./routes/auth');
const titlesRoute = require('./routes/titles');
const uploadRoute = require('./routes/uploads');
const commentRoute = require('./routes/comment');
const userprofileRoute = require('./routes/userprofile');
const followersRoute = require('./routes/follow');
const watchedRoute = require('./routes/watchedvideos');
const likeRoute = require('./routes/likes');
dotenv.config();
mongoose.connect('*****', {useNewUrlParser: true,}, () => console.log('connected'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/api/', uploadRoute);
app.use('/api/user', authRoute);
app.use('/api/', titlesRoute);
app.use('/api/userprofile', userprofileRoute);
app.use('/api/', commentRoute);
app.use('/api/', followersRoute);
app.use('/api/', watchedRoute);
app.use('/api/', likeRoute);




//Route Middlewares                
app.use(express.json());

app.listen(4000, () => console.log('Server is running'));