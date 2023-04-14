const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

// Hash Password
async function encriptPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

module.exports = {
  registerUser: async (req, res) => {
    // Lets Validate the Data Before we have a user
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if the user is aready in th database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      return res.status(400).json("Email already exist");
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: await encriptPassword(req.body.password),
    });
    try {
      const savedUser = await user.save();
      res.status(200).json({ user: user._id });
    } catch (error) {
      res.status(404).json(error);
    }
  },

  loginUser: async (req, res) => {
    // Lets Validate the Data Before we have a user
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if email exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json("Password or Email does not exist");
    }
    //Password Correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(400).json("Invalid Password");
    }

    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header("auth-token", token).send({
      status: "success",
      data: {
        token: token,
      },
    });
  },
};
