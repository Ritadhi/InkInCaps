var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');

var Student = require('../models/student');
var Leader = require('../models/leader');

var DB = mongoose.connection.on("open", function () { });
var Profiles = DB.collection('studentPhotos.files');
var Chunks = DB.collection('studentPhotos.chunks');

var storage = new GridFsStorage({
  url: "mongodb://localhost/demo",
  file: (req, file) => {
    return {
      bucketName: 'studentPhotos',
      filename: 'image-' + Date.now()
    }
  }
});

var upload = multer({ storage: storage });

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/addLeader', isAuthorized, (req, res, next) => {
  var leader = new Leader({email: req.body.email, name: req.body.name, time: req.body.time, level: req.body.level});
  return leader.save(function() {});
})

router.post('/fetchLeaderBoard', isAuthorized, (req, res, next) => {
  Leader.find({level: req.body.level}, function(err, leaders) {
    return res.json(leaders);
  }).sort({time: 1})
})

router.post('/addStudent', isAuthorized, (req, res, next) => {
  Student.findOne({ student_id: req.body.studentID }).then(student => {
    if (student) {
      return res.status(501).json({ message: 'Student Alresdy Exists!!!' });
    } else {
      addToDB(req, res);
    }
  })
});

async function addToDB(req, res) {
  var student = new Student({
    studentName: req.body.studentName,
    fatherName: req.body.fatherName,
    dob: req.body.dob,
    gender: req.body.gender,
    course: req.body.course,
    mobile: req.body.mobile,
    email: req.body.email,
    address: req.body.address,
    createdAt: Date.now()
  });
  try {
    doc = await student.save();
    return res.status(201).json(doc);
  }
  catch (err) {
    return res.status(501).json(err);
  }
}

router.post('/photo', upload.single('photo'), (req, res, next) => {
  if (!req.file) {
    return res.status(500).send({ message: 'Upload fail' });
  } else {
    Student.findOne({ _id: req.body.id }, function (err, student) {
      if (student.photo) {
        Profiles.find({ filename: student.photo }).toArray(function (err, docs) {
          Chunks.deleteMany({ files_id: docs[0]._id }, function (err, chunk) { })
        })
        Profiles.deleteMany({ filename: student.photo }, function (err, docs) { })
      }
      req.body.photo = req.file.filename;
      student.photo = req.body.photo;
      student.save(function () { });
      return;
    })
  }
  return;
})

router.post('/profilePhoto', isAuthorized, (req, res) => {
  Profiles.find({ filename: req.body.photo }).toArray(function (err, docs) {
    Chunks.find({ files_id: docs[0]._id })
      .sort({ n: 1 }).toArray(function (err, chunks) {
        let fileData = [];
        fileData.push(chunks[0].data.toString('base64'));
        let finalFile = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
        return res.send({ imgurl: finalFile });
      })
  })
})

router.get('/countStudent', isAuthorized, (req, res) => {
  Student.countDocuments({}, function(err, count) {
    return res.json(count);
  })
})

router.post('/getStudent', isAuthorized, (req, res, next) => {
  Student.find({}, function(err, student) {return res.json(student)}).limit(5).skip(req.body.studentNo - 5);
})

router.post('/getStudentById', isAuthorized, (req, res, next) => {
  Student.findOne({_id: req.body.id}, function(err, student) {
    return res.json(student);
  })
})

router.post('/edit', isAuthorized, (req, res, next) => {
  Student.findOne({_id: req.body.id}, function(err, student) {
    student.studentName = req.body.body.studentName;
    student.fatherName = req.body.body.fatherName;
    student.dob = req.body.body.dob;
    student.gender = req.body.body.gender;
    student.course = req.body.body.course;
    student.mobile = req.body.body.mobile;
    student.email = req.body.body.email;
    student.address = req.body.body.address;
    student.save(function() {});
    return res.json(student);
  })
})

router.post('/deleteStudent', isAuthorized, (req, res, next) => {
  Student.findOne({ _id: req.body.id }, function (err, student) {
    if (student.photo) {
      Profiles.find({ filename: student.photo }).toArray(function (err, docs) {
        Chunks.deleteMany({ files_id: docs[0]._id }, function (err, chunk) { })
      })
      Profiles.deleteMany({ filename: student.photo }, function (err, docs) { })
    }
  })
  Student.deleteOne({_id: req.body.id}, function(err, student) {return res.json(student)});
})

function isAuthorized(req, res, next) {
  if(req.headers.authorization.split(' ')[1] === 'MY_TOKEN'){ // Auth Token must be in the .env file;
    next();
  }
  else return res.status(401).json({ message: 'Unauthorized Request!!!' });
};

module.exports = router;
