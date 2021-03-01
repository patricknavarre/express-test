var express = require('express');
var axios = require('axios');
var router = express.Router();

const {
  login,
  signup,
} = require("./controller/userController")

const { checkSignupInputIsEmpty } = require("./lib/checkSignUp");
const { checkSignupDataType} = require("./lib/checkSignupDataType")
const { checkLoginEmptyMiddleware, checkEmailFormat } = require("./lib/checkLogin");


/***************
 * CREATE USER *
 ***************/
router.get('/create-user', function (req, res, next) {
  if(req.session.user) {
    res.redirect('home');
  } else {
    res.render('sign-up');
  }
});

/*************
 * GET LOGIN *
 *************/
router.get('/login', function (req, res, next) {
  if(req.session.user) {
    res.redirect('home');
  } else {
    res.render('login');
  }
});


/************
 * GET HOME *
 ************/
router.get('/home', async function (req, res, next) {
  if(req.session.user) {
    res.render("home", {user: req.session.user.email})
  } else {
    res.render('message', {error:true});
  }
});



/*************
 * POST HOME *
 *************/

router.post("/home", async function (req, res) {
  if(req.session.user) {
    try {
      let result = await axios.get(

        // `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${req.body.search}`
        // `https://api.openweathermap.org/data/2.5/weather?q={chicago}&appid=${process.env.OpenWeather_API_KEY}&q=${req.body.search}`
        // `http://api.openweathermap.org/data/2.5/weather?q=${req.body.search}&appid=${OpenWeather_API_KEY}`
        
      );
      console.log(result.data);
      res.render("home", { data: result.data, city: req.body.search});
    } catch (e) {
      console.log(e)
      res.status(500).json({
        message: "failure",
        data: e.message,
      });
    }
  } else {
    res.render("message", {error:true})
  }
});


/********************
 * POST CREATE USER *
 ********************/
router.post("/create-user", checkSignupInputIsEmpty, checkSignupDataType, signup);

/**************
 * POST LOGIN *
 **************/
router.post("/login", checkLoginEmptyMiddleware, checkEmailFormat, login);

/**************
 * GET LOGOUT *
 **************/
router.get("/logout", function (req, res) {
  req.session.destroy();
  res.clearCookie("connect.sid", {
    path: "/",
    httpOnly: true,
    secure: false,
    maxAge: null,
  })
  res.redirect("login");
});

module.exports = router;