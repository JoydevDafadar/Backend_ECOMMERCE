const { User } = require("../model/User");
const crypto = require("crypto");
const { sanitizeUser } = require("../services/common");

var jwt = require("jsonwebtoken");
const SECRATE_KEY = "SECRATE";

exports.createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await User.findOne({ email: email });
      if (user) {
        res
          .status(401)
          .json({ message: "user is already Registerd. Try to Log In" });
      } else {
        var salt = crypto.randomBytes(16);
        crypto.pbkdf2(
          req.body.password,
          salt,
          310000,
          32,
          "sha256",
          async function (err, hashedPassword) {
            const doc = new User({
              ...req.body,
              password: hashedPassword,
              salt: salt
            })
            const document = await doc.save();

            var token = jwt.sign(sanitizeUser(document), SECRATE_KEY);

            req.login(sanitizeUser(document), (err) => {
              if( err ){
                res.sendStatus(400);
              }
              else{
                res.status(201).json({user: document, token});
              }

            })

          }
        );
      }
    } else {
      res.status(401).json({ message: "Send All Fields" });
    }
  } catch (err) {
    res.status(400).json({ message: "User is already Registered. Try Log In" });
  }
};

exports.loginUser = async (req, res) => {
  res.json({ success: true, user: req.user });
};
exports.checkUser = async (req, res) => {
  const user = await User.findById(req.user.id);
  delete user.salt;
  delete user.password;
  res.json({ success: true, user: user });
};
