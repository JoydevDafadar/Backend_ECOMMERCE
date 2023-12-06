const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const { isAuth, sanitizeUser } = require("./services/common");

require('dotenv').config();

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const SECRATE_KEY = "SECRATE";
var jwt = require("jsonwebtoken");
// var token = jwt.sign({ foo: "bar" }, "shhhhh");

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRATE_KEY;

//session middleware and passport authentication
server.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
server.use(passport.authenticate("session"));

//Authontication

const productRouter = require("./Routes/Products");
const userRouter = require("./Routes/User");
const authRouter = require("./Routes/Auth");
const cartRouter = require("./Routes/Cart");
const orderRouter = require("./Routes/Order");

//MiddleWare

server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));

server.use(express.json());
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);

server.use("/products", productRouter.router);
server.use("/user", userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", cartRouter.router);
server.use("/orders", orderRouter.router);

// Passport stratigies
const { User } = require("./model/User");

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: email }).exec();
      if (!user) {
        done(null, false, { message: "Invalid Credential " });
      } else {
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          function (err, hashedPassword) {
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              done(null, false, { message: "Invalid Credential " });
            } else {
              var token = jwt.sign(sanitizeUser(user), SECRATE_KEY);
              done(null, { token: token, user: user });
            }
          }
        );
      }
    } catch (error) {
      done(error);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log({ id : jwt_payload.id });
    try {
      const user = await User.findOne({ _id: jwt_payload.id }).exec();
      // console.log( user );
      if (user) {
        // console.log( user, 'done');
        // console.log(sanitizeUser(user));
        return done(null, sanitizeUser(user));
      } else {
        return done(null, false, { message: 'user is not found'});
        // or you could create a new account
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

//Serialaization
passport.serializeUser(function (user, cb) {
  // console.log("run se");
  // console.log( user, "from seria" )
  process.nextTick(function () {
    return cb(null, user);
  });
});

// Deseialaization
passport.deserializeUser(async function (user, cb) {
  return cb(null, user);
  // console.log( 'run de' )
  // const user = await User.findById(id).exec();
  // process.nextTick( function() {
  //   return cb(null, user);
  // })
});

// Connect DB and Starting Server
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Database Connected");
}

server.listen(8080, (req, res) => {
  console.log("Server Started");
});
