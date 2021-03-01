const bcrypt = require('bcryptjs');
const User = require("../model/User");

module.exports = {


  getAllUsers: async (req, res) => {
    try {
      const foundAllUsers = await User.find({});

      res.status(200).json({
        message: "success",
        users: foundAllUsers,
      });
    } catch (error) {
      res.status(500).json({
        message: "failure",
        errorMessage: error.message,
      });
    }
  },

    signup: async (req, res) => {
        
        const { firstName, lastName, email, password } = req.body

        try {
            const salted = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salted);

            const createdUser = new User({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                password: hashedPassword,
            });

            let savedUser = await createdUser.save();

            // res.status(200).json({
            //     message: "success",
            //     user: savedUser,
            // })
            res.render("sign-up", { success: true })
        } 
        catch (error) {
            res.status(500).json({
                message: "error",
                errorMessage: error.message,
            })
        }
    },
    
    home: async (req, res) => {
        if(req.session.user) {
            try {
              let result = await axios.get(
                
                `http://api.openweathermap.org/data/2.5/weather?q=${req.body.search}&appid=${OpenWeather_API_KEY}`
                
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
    },

    login: async (req, res) => {
        try {
            let foundUser = await User.findOne({ email: req.body.email });
            if (!foundUser) {
                res.render('sign-up', {
                    error: {
                        message: "That user does not exist.  Please try again.", 
                    }
                    });
                // res.render("login", {error:null, error2: true, error3: null, success:null})
                // res.status(404).json({
                //     message: "failure",
                // });
            } else {
                let isPasswordTrue = await bcrypt.compare(
                    req.body.password,
                    foundUser.password
                );
                if (isPasswordTrue) {
                    req.session.user = {
                        _id: foundUser._id,
                        email: foundUser.email,
                    }
                    res.redirect("/users/home")
                    // res.render("home", { user: foundUser.email })
                } else {
                    res.render("login", {
                        error: {
                            message: "Please check your email and password."
                        }
                    })
                    // res.status(500).json({
                    //     message: "failure",
                    //     successMessage: "please check your email and password",
                    // });
                }
            }
        } catch (error) {
            res.status(500).json({
                message: "error",
                errorMessage: error.message,
            });
        }
    }
}
