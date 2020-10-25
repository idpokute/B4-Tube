const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { User } = require('./models/User');
const { Video } = require('./models/Video');
const { Subscriber } = require('./models/Subscriber');
const { Comment } = require('./models/Comment');
const { auth } = require('./middleware/auth');
const path = require('path');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// application/json
app.use(bodyParser.json());
app.use(cookieParser());
// For upload folder
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB connected...'))
  .catch(error => console.log(error));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/hello', (req, res) => {
  res.send('Hello Pong');
});

app.post('/api/users/register', (req, res) => {
  // register user register form data into database
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });

    return res.status(200).json({
      success: true,
    });
  });
});

app.post('/api/users/login', (req, res) => {
  // Search email
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: 'Cannot find email.',
      });
    }

    // Check Password
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: 'Wrong password',
        });
      }

      // Create Token
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // Save Token at Cookie
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      token: '',
    },
    (err, user) => {
      if (err) return res.json({ success: false, err });

      return res.status(200).send({
        success: true,
      });
    }
  );
});

// For Multer
const multer = require('multer');
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    console.log(file.mimetype);
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    // Later, we need to change to mp4
    if (ext !== '.mp4') {
      console.log('it is not jpg');
      return cb(new Error('only mp4 is allowed'), false);
    }
    cb(null, true);
  },
}).single('file');

app.post('/api/video/uploadfiles', (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

const ffmpeg = require('fluent-ffmpeg');
app.post('/api/video/thumbnail', (req, res) => {
  let filePath = '';
  let fileDuration = '';

  // Get Video Info
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);
    fileDuration = metadata.format.duration;
  });

  // Create thumbnail and get running time
  ffmpeg(req.body.url)
    .on('filenames', filenames => {
      console.log('will generate ' + filenames.join(', '));
      console.log(filenames);

      filePath = 'uploads/thumbnails/' + filenames[0];
      fileName = filenames[0];
    })
    .on('end', () => {
      console.log('screenshot taken');
      return res.json({
        success: true,
        url: filePath,
        fileDuration: fileDuration,
      });
    })
    .on('error', err => {
      console.error(err);
      return res.json({ success: false, err });
    })
    .screenshot({
      count: 3,
      folder: 'uploads/thumbnails',
      size: '320x240',
      filename: 'thumbnail-%b.png',
    });
});

app.post('/api/video/uploadVideo', (req, res) => {
  // save data
  const video = new Video(req.body);

  video.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

app.get('/api/video/getVideos', (req, res) => {
  Video.find()
    .populate('writer')
    .exec((err, videos) => {
      if (err) return res.status(400);

      return res.json({ success: true, videos });
    });
});
app.post('/api/video/getVideo', (req, res) => {
  Video.findOne({ _id: req.body.videoId })
    .populate('writer')
    .exec((err, video) => {
      if (err) return res.status(400);

      return res.json({ success: true, video });
    });
});

app.post('/api/video/getSubscriptionVideos', (req, res) => {
  // Find my subscribed videos
  Subscriber.find({ userFrom: req.body.userFrom }).exec(
    (err, subscriberInfo) => {
      if (err) return res.status(400);

      // Get All subscribers of mine
      let subscribedUser = [];

      subscriberInfo.map((subscriber, index) => {
        subscribedUser.push(subscriber.userTo);
      });

      // Get all videos of my subscribers
      Video.find({ writer: { $in: subscribedUser } })
        .populate('writer')
        .exec((err, videos) => {
          if (err) return res.status(400).send(err);

          return res.status(200).json({ success: true, videos });
        });
    }
  );
});

app.post('/api/subscribe/subscribeNumber', (req, res) => {
  Subscriber.find({ userTo: req.body.userTo })
    // .populate('writer')
    .exec((err, subscribe) => {
      if (err) return res.status(400);

      console.log(subscribe.length);

      return res
        .status(200)
        .json({ success: true, subscribeNumber: subscribe.length });
    });
});

app.post('/api/subscribe/subscribed', (req, res) => {
  Subscriber.find({ userTo: req.body.userTo, userFrom: req.body.userFrom })
    // .populate('writer')
    .exec((err, subscribe) => {
      if (err) return res.status(400);

      let result = false;
      if (subscribe.length !== 0) {
        result = true;
      }

      return res.status(200).json({ success: true, subscribed: result });
    });
});

app.post('/api/subscribe/unsubscribe', (req, res) => {
  Subscriber.findOneAndDelete({
    userTo: req.body.userTo,
    userFrom: req.body.userFrom,
  })
    // .populate('writer')
    .exec((err, doc) => {
      if (err) return res.status(400).json({ success: false, err });

      return res.status(200).json({ success: true, doc });
    });
});

app.post('/api/subscribe/subscribe', (req, res) => {
  const subscribe = new Subscriber(req.body);

  subscribe.save((err, doc) => {
    if (err) return res.json({ success: false, err });

    res.status(200).json({ success: true });
  });
});

// Comments
app.post('/api/comment/saveComment', (req, res) => {
  const comment = new Comment(req.body);

  comment.save((err, comment) => {
    if (err) return res.json({ success: false, err });

    // To include writer information
    Comment.find({ _id: comment._id })
      .populate('writer')
      .exec((err, result) => {
        if (err) return res.json({ success: false, err });

        res.status(200).json({ success: true, result });
      });
  });
});

app.post('/api/comment/getComments', (req, res) => {
  Comment.find({ postId: req.body.videoId })
    .populate('writer')
    .exec((err, result) => {
      if (err) return res.json({ success: false, err });

      res.status(200).json({ success: true, comments: result });
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
