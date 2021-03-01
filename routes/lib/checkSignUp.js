/*******************************************************************************
 * PULL IN THE CHECKISEMPTY FUNCTION FROM AUTHMETHODS.JS FILE USING REQUIRE *
 *******************************************************************************/
const { isEmpty } = require("validator");

/**************************************************************************
 * FUNCTION THAT IS CHECKING IF ANY OF THE USER INPUT FIELDS ARE EMPTY *
 **************************************************************************/
const checkSignupInputIsEmpty = (req, res, next) => {
  let errorObj = {};

  const { firstName, lastName, email, password } = req.body;

  if (isEmpty(firstName)) {
    errorObj.firstName = "First Name cannot be empty";
  }

  if (isEmpty(lastName)) {
    errorObj.lastName = "Last Name cannot be empty";
  }

  if (isEmpty(email)) {
    errorObj.email = "email cannot be empty";
  }

  if (isEmpty(password)) {
    errorObj.password = "password cannot be empty";
  }

  if (Object.keys(errorObj).length > 0) {

    res.render("sign-up", { error: errorObj });
    // res.status(500).json({
    //   message: "Error",
    //   data: errorObj,
    // });
  } else {
    //It means go to the next function
    next();
  }
};

// exporting out the function using module.exports
module.exports = {
  checkSignupInputIsEmpty,
};
