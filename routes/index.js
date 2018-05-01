const express = require('express')
const router = express.Router();
var passport = require('passport');
var session = require('express-session'); 
var mongoose = require('mongoose');
var Strategy = require('passport-facebook').Strategy;
var currentUser; 



var Schema = mongoose.Schema;
//configure to fb strategy for use by passport
/*passport.use(new Strategy({
  clientID: 193031364810079,
  clientSecret: '882ca5f6cf0395e9c3050ef71341fcc9',
  callbackURL: "https://kweeni-team1.herokuapp.com/kweeni"
},
function (accessToken, refreshToken, profile, cb) { // access, refresh, profile, done
  console.log("in fb function"); 
  process.nextTick(function () {
    console.log("found fb data ");
    var query = QuestionsData.findOne({
      "user.fbId": profile.id
    })
    query.exec(function (err, oldUser) {
      if (oldUser) {
        console.log('Existing user: ' + oldUser.name + ' found and logged in!');
        cb(null, oldUser);
        currentUser = "lisa"; 
      } else {
        var newUser = new QuestionsData(); 
        newUser.user.fbId = profile.id;
        newUser.user.name = profile.displayName;
        newUser.user.img = profile.picture.url;
        console.log(newUser); 

        currentUser = "Caroline"; 

        newUser.save(function (err) {
          if (err) {
            return cb(err);
          }
          console.log('New user: ' + newUser.name + ' created and logged in!');
          cb(null, newUser);
        });
      }
    });
  });
})); */

// Configure Passport authenticated session persistence.
/*passport.serializeUser(function(user, cb) {
  // save to session req.session.passport.user 
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
  // user object attaches to the request as req.user
});*/

// blueprint (define layout)
var questionsDataSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  likes: {
    type: Number
  },
  search_name: {
    type: String
  },
  current_date: {
    type: Date
  },
  user: {
    _id: {
      type: Number
    },
    _fbId: {
      type: Number
    },
    name: {
      type: String
    },
    img: {
      type: String
    }
  },
  answers: [{
    _id: {
      type: Number
    },
    text: {
      type: String
    },
    user: {
      _id: {
        type: Number
      },
      name: {
        type: String
      },
      img: {
        type: String
      }
    },
    comments: [{
      _id: {
        type: Number
      },
      text: {
        type: String
      },
      user: {
        _id: {
          type: Number
        },
        name: {
          type: String
        },
        img: {
          type: String
        }
      }
    }]
  }]
}, {
  collection: 'questions'
}); // stores data in collection

// create model of that blueprint
var QuestionsData = mongoose.model('QuestionsData', questionsDataSchema)

/* GET home */
router.get('/', function (req, res) {
  res.render('./home', { title: 'Home', user: req.user });
});

//facebook
router.get('/facebook',
  passport.authenticate('facebook'));

router.get('/facebook/return', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    alert('request: ' + req); 
    res.redirect('/kweeni');
    alert("kweeni!"); 
  });


/* Verify user login. */
router.post('/', function(req, res) {
  alert("in post function"); 
  passport.authenticate('facebook', function(err, user, info) {
      if (err) {
          console.log(err); 
      }
      if (!user) {
          var message = "Invalid credentials";
          alert("message " + info.message);
      }
      request.logIn(user, function (err) {
          if (err) {
              console.log(err);
          }
          request.session.user = user;
          alert('login gelukt :D'); 
          //response.redirect('/kweeni');
      });
  })(req, res);
});


/* GET kweeni + data */
router.get('/kweeni', function (req, res) {
  // sort by date
  QuestionsData.find().sort({
      current_date: -1
    })
    .then(function (result) {
      //console.log(result);
      res.render('kweeni', {
        questionslist: result,
        user: currentUser
      });
    });
});

/* GET wat is + id */
router.get('/kweeni/:id', function (req, res) {
  var id = req.params.id;
  QuestionsData.findOne({
      search_name: id
    })
    .then(function (result) {
      if (result == null) {
        res.render('error', {
          message: 'id not found'
        });
      } else {
        var minutes = result.current_date.getMinutes();
        console.log(minutes);
        res.render('watis', {
          title: id,
          question: result,
          question_min: minutes,
          answerlist: result.answers,
          commentlist: result.answers.comments
        });
      }
    });
});

/* POST kweeni + save data  */
router.post('/kweeni', function (req, res, next) {
  var item = {
    text: req.body.question__input,
    likes: 0,
    search_name: req.body.question__input.split(" ").join("-"),
    current_date: new Date(Date.now()).toLocaleString(),
    user: {
      _id: 1,
      name: req.user,
      img: ""
    }
  };

  // create instance of model 
  var data = new QuestionsData(item);
  data.save();
  res.redirect('/kweeni');
});

/* UPDATE likes */
router.post('/kweeni', function (req, res, next) {
  // find by id? 
});

module.exports = router;