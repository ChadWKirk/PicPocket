const express = require("express");
const https = require("https");
const fs = require("fs");
const app = express();
const path = require("path");
const hbs = require("nodemailer-express-handlebars");
const router = express.Router();
require("dotenv").config({ path: "./config.env" });
const cors = require("cors");
const port = process.env.PORT || 5000;
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const createToken = (_id) => {
  return jwt.sign({ _id: _id }, process.env.JWT_SECRET);
};
const multer = require("multer");
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });

//for mkcert to run https localhost
// const options = {
//   key: fs.readFileSync(`./node_modules/mkcert/src/cert.key`),
//   cert: fs.readFileSync(`./node_modules/mkcert/src/cert.crt`),
// };

//sort helper function so you don't have to copy and paste the same thing for every sort route
function ifSortIsXHelperFunction(sort) {
  if (sort == "most-recent") {
    sortBy = { created_at: -1 };
  } else if (sort == "oldest") {
    sortBy = { created_at: 1 };
  } else if (sort == "atoz") {
    sortBy = { title: 1 };
  } else if (sort == "ztoa") {
    sortBy = { title: -1 };
  } else if (sort == "leastlikes") {
    sortBy = { likes: 1 };
  } else if (sort == "mostlikes") {
    sortBy = { likes: -1 };
  }
}

//cloudinary image hosting
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

const dbo = require("./db/conn");
const { ObjectId } = require("mongodb");
const { error } = require("console");

app.get("/", (req, res) => {
  res.send("ok");
});

// for https

// https.createServer(options, app).listen(port, () => {
//   dbo.connectToServer((err) => {
//     if (err) console.log(err);
//   });
//   console.log("server has connected.");
// });

// for normal

app.listen(port, () => {
  dbo.connectToServer((err) => {
    if (err) console.log(err);
  });
  console.log("server has connected.");
});

//upload image(s) post
//upload.array is for multer
app.use("/upload", upload.array("files", 200), async (req, res) => {
  //use npm browser-image-compression to shrink image before hitting Cloudinary, to get under 10MB limit
  let db_connect = dbo.getDb();
  let uploadToMongoBody;
  //random 6 digit number to tag onto the public_id to allow images to be named the same thing but have different public_ids
  let randomNumber = Math.floor(100000 + Math.random() * 900000);
  //make sure it's working
  console.log("upload start");
  console.log("req.files");
  console.log(req.files);
  console.log("req.body");
  console.log(req.body);
  //upload to cloudinary
  await cloudinary.uploader
    .upload(`images/${req.files[0].originalname}`, {
      folder: "picpocket",
      public_id: `${req.files[0].originalname
        .split(" ")
        .join("-")
        .replace(".jpg", "")
        .replace(".JPG", "")
        .replace(".png", "")
        .replace(".PNG", "")
        .replace(".jpeg", "")
        .replace(".JPEG", "")}-${randomNumber}`,
      colors: true,
    })
    .then((result) => {
      //upload to mongoDB
      console.log(result);
      uploadToMongoBody = result;
      uploadToMongoBody.likes = 0;
      uploadToMongoBody.likedBy = [];
      uploadToMongoBody.uploadedBy = req.body.uploaderName;
      uploadToMongoBody.title = req.files[0].originalname
        .replace(".jpg", "")
        .replace(".JPG", "")
        .replace(".png", "")
        .replace(".PNG", "")
        .replace(".jpeg", "")
        .replace(".JPEG", "");
      uploadToMongoBody.description = "";
      uploadToMongoBody.imageType = "photo";
      db_connect.collection("picpocket-images").insertOne(result);
      //remove file from images folder once it is successfully uploaded to cloudinary and mongoDB
      fs.unlink(`images/${req.files[0].originalname}`, function (err) {
        if (err) {
          throw err;
        } else {
          console.log(
            "file removed from images folder after uploading successfully."
          );
        }
      });
      res.json({
        secure_url: uploadToMongoBody.secure_url,
        public_id: uploadToMongoBody.public_id,
        asset_id: uploadToMongoBody.asset_id,
      });
    })
    .catch(console.log("error"));
});

//upload pfp post
app.use(
  "/pfpUpload/:username/:oldPFP",
  upload.single("file"),
  async (req, res) => {
    let uploadToMongoBody;
    //req.body.secure_url for new PFP src
    let oldPFPID = "picpocket/" + req.params.oldPFP;
    let db_connect = dbo.getDb();
    //make sure it's working
    console.log("upload pfp start");
    console.log(req.body);
    console.log(req.file);
    //random 6 digit number to tag onto the public_id to allow images to be named the same thing but have different public_ids
    let randomNumber = Math.floor(100000 + Math.random() * 900000);

    //upload new PFP to cloudinary
    //upload to cloudinary
    await cloudinary.uploader
      .upload(`images/${req.file.originalname}`, {
        folder: "picpocket",
        public_id: `${req.file.originalname
          .split(" ")
          .join("-")
          .replace(".jpg", "")
          .replace(".JPG", "")
          .replace(".png", "")
          .replace(".PNG", "")
          .replace(".jpeg", "")
          .replace(".JPEG", "")}-${randomNumber}`,
        colors: true,
      })
      .then((result) => {
        //upload to mongoDB
        console.log(result);
        uploadToMongoBody = result;
        uploadToMongoBody.likes = 0;
        uploadToMongoBody.likedBy = [];
        uploadToMongoBody.uploadedBy = req.body.uploaderName;
        uploadToMongoBody.title = req.file.originalname
          .replace(".jpg", "")
          .replace(".JPG", "")
          .replace(".png", "")
          .replace(".PNG", "")
          .replace(".jpeg", "")
          .replace(".JPEG", "");
        uploadToMongoBody.description = "";
        uploadToMongoBody.imageType = "photo";
        db_connect.collection("picpocket-pfps").insertOne(uploadToMongoBody);
        //change pfp to uploaded image
        db_connect.collection("picpocket-users").updateOne(
          {
            username: req.params.username,
          },
          {
            $set: {
              pfp: result.secure_url,
            },
          }
        );
        //remove file from images folder once it is successfully uploaded to cloudinary and mongoDB
        fs.unlink(`images/${req.file.originalname}`, function (err) {
          if (err) {
            throw err;
          } else {
            console.log(
              "file removed from images folder after uploading successfully."
            );
          }
        });
        //delete old pfp from mongoDb
        db_connect
          .collection("picpocket-pfps")
          .deleteOne({ public_id: oldPFPID });

        //delete old pfp from Cloudinary
        //if old pfp is not the default purple pfp, delete it (to avoid deleting the default purple pfp)
        if (oldPFPID != "picpocket/default_purple_pfp_ibof5p") {
          cloudinary.uploader
            .destroy(oldPFPID, { invalidate: true })
            .then((result) => {
              console.log(result);
            })
            .catch((error) => {
              console.log(error);
            });
        }
        res.json({
          secure_url: uploadToMongoBody.secure_url,
          public_id: uploadToMongoBody.public_id,
          asset_id: uploadToMongoBody.asset_id,
        });
      })
      .catch(console.log("error"));
  }
);

app.get("/users", (req, res) => {
  let db_connect = dbo.getDb();

  db_connect
    .collection("picpocket-users")
    .find()
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } else {
        res.json(result);
      }
    });
});
//get currently signed in user
// app.get("/curUser", (req, res) => {
//   db_connect = dbo.getDb();
//   //see if any user has signedIn: true
//   db_connect
//     .collection("picpocket-users")
//     .findOne({ signedIn: true }, function (err, user) {
//       if (err) {
//         console.log(err);
//       }
//       if (user) {
//         console.log("user found");
//         res.json(user.username); //send username in resopnse to react fetch
//       }
//     });

//   db_connect
//     .collection("picpocket-users")
//     .findOne({ signedIn: true }, function (err, user) {
//       if (err) {
//         console.log(err);
//       }
//       if (!user) {
//         console.log("user not found");
//         res.json("none"); //send username in resopnse to react fetch
//       }
//     });
// });

//sign up post
app.post("/signup", async (req, response) => {
  //validation
  if (!validator.isEmail(req.body.email)) {
    response.json("Email is not valid");
    return;
  }
  if (!validator.isStrongPassword(req.body.password)) {
    response.json("Password is not strong enough");
    return;
  }

  //password hashing
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);

  let db_connect = dbo.getDb();

  //check if username or email already exists
  db_connect
    .collection("picpocket-users")
    .find({ $or: [{ username: req.body.username }, { email: req.body.email }] })
    .toArray(function (err, result) {
      if (err) {
        response.status(400).send("error");
        console.log("to array error");
      } else if (result.length > 0) {
        if (
          //if both already exist
          result.some((e) => e.username === req.body.username) &&
          result.some((e) => e.email === req.body.email)
        ) {
          response.json("Both");
          console.log("Username and Email already exist. Sign up failed.");
        } else if (result.some((e) => e.email === req.body.email)) {
          response.json("Email");
          console.log("Email already exists. Sign up failed.");
        } else if (result.some((e) => e.username === req.body.username)) {
          response.json("Username");
          console.log("Username already exists. Sign up failed.");
        }
      } else {
        console.log("user is new");
        async function insertNew() {
          //insertone as signedIn: true
          db_connect.collection("picpocket-users").insertOne(
            {
              type: "normal",
              username: req.body.username,
              password: hash,
              email: req.body.email,
              verified: false,
              verifyToken: "tokenPlaceholder",
              forgotPWToken: "tokenPlaceholder",
              bio: "",
              pfp: "https://res.cloudinary.com/dtyg4ctfr/image/upload/v1674238936/PicPocket/default_purple_pfp_ibof5p.jpg",
              // signedIn: true,
            },
            function (err, user) {
              if (err) {
                throw err;
              } else {
                //create token to send in email verification link
                const name = req.body.username;
                const token = createToken(user.insertedId);
                response.status(200).json({ name, token });
                //update new user's token field with the new token's value
                db_connect
                  .collection("picpocket-users")
                  .updateOne(
                    { username: req.body.username },
                    { $set: { verifyToken: token } }
                  );
                //send verification email
                const transporter = nodemailer.createTransport({
                  host: "smtp.zoho.com",
                  port: 465,
                  secure: true,
                  auth: {
                    user: process.env.EMAIL_SENDER_USER,
                    pass: process.env.EMAIL_SENDER_PASS,
                  },
                });

                //point to template folder
                const handlebarsOptions = {
                  viewEngine: {
                    partialsDir: path.resolve("./views/"),
                    defaultLayout: false,
                  },
                  viewPath: path.resolve("./views/"),
                };

                //use template file
                transporter.use("compile", hbs(handlebarsOptions));

                const mailConfigurations = {
                  // It should be a string of sender/server email
                  from: "administrator@picpoccket.com",

                  to: req.body.email,

                  // Subject of Email
                  subject: "PicPocket Email Verification",

                  template: "email", //name of template file in views folder - email.handlebars

                  context: {
                    //variables to use in email.handlebars
                    name: req.body.username,
                    linkName: req.body.username.split(" ").join("-"),
                    token: token,
                  },

                  // This would be the text of email body
                  //   text: `Hi! There, You have recently visited
                  //   our website and entered your email.
                  //   Please follow the given link to verify your email
                  //   localhost:3000/${req.body.username}/verify/${token}
                  //   Thanks`,
                };

                transporter.sendMail(
                  mailConfigurations,
                  function (error, info) {
                    if (error) throw Error(error);
                    console.log("Email Sent Successfully");
                    console.log(info);
                  }
                );
              }
            }
          );
        }
        insertNew();
      }
    });
});

//Send Forgot Password Link
app.post("/send-forgot-password-link", (req, res) => {
  console.log("forgot test");
  //check if email is a valid email
  if (!validator.isEmail(req.body.email)) {
    res.json("Email is not valid");
    return;
  }

  //check if req.body.email belongs to any existing account
  //use regex option i to search for any email that matches, case insensitive
  let db_connect = dbo.getDb();

  db_connect
    .collection("picpocket-users")
    .findOne(
      { email: { $regex: req.body.email, $options: "i" } },
      async function (err, user) {
        if (err) {
          console.log(err);
          res.json("error");
        } else if (user) {
          //create token that expires in 60 minutes
          let resetPWToken = crypto.randomBytes(32).toString("hex");

          //create hash of token to store in DB
          const salt = await bcrypt.genSalt(10);
          const hash = {
            token: await bcrypt.hash(resetPWToken, salt),
            createdAt: {
              type: Date,
              default: new Date(),
              expires: new Date().setMinutes(new Date().getMinutes() + 60),
            },
          };
          //add token to forgotPWToken field in user
          db_connect
            .collection("picpocket-users")
            .updateOne(
              { email: req.body.email },
              { $set: { forgotPWToken: hash } }
            );
          //send email to req.body.email containing link that contains token
          const transporter = nodemailer.createTransport({
            host: "smtp.zoho.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.EMAIL_SENDER_USER,
              pass: process.env.EMAIL_SENDER_PASS,
            },
          });

          //point to template folder
          const handlebarsOptions = {
            viewEngine: {
              partialsDir: path.resolve("./views/"),
              defaultLayout: false,
            },
            viewPath: path.resolve("./views/"),
          };

          //use template file
          transporter.use("compile", hbs(handlebarsOptions));

          const mailConfigurations = {
            // It should be a string of sender/server email
            from: "administrator@picpoccket.com",

            to: req.body.email,

            // Subject of Email
            subject: "PicPocket Password Reset Link",

            template: "passwordReset", //name of template file in views folder - email.handlebars

            context: {
              //variables to use in email.handlebars
              name: user.username,
              linkName: user.username.split(" ").join("-"),
              token: resetPWToken,
              link: `http://picpoccket.com/${user.username}/reset-password/${resetPWToken}`,
            },
          };

          transporter.sendMail(mailConfigurations, function (error, info) {
            if (error) {
              throw Error(error);
            } else {
              console.log("Email Sent Successfully");
              console.log(info);
              res.json("forgot password link sent");
            }
          });
        } else {
          res.json("email does not belong to any account");
        }
      }
    );
});

//Check if forgot password token is expired when going to reset password page
app.get("/:username/check-forgot-token/:token", async (req, res) => {
  console.log("check forgot token test");

  const token = req.params.token;
  const username = req.params.username.split("-").join(" ");

  let db_connect = dbo.getDb();

  //check token in params with hash in db
  //see if token being used is expired
  db_connect
    .collection("picpocket-users")
    .findOne({ username: username }, async function (err, user) {
      if (err) {
        res.json("error");
        console.log(err);
      } else if (user) {
        const tokenMatch = await bcrypt.compare(
          token,
          user.forgotPWToken.token
        );
        if (!tokenMatch) {
          res.json("token expired");
          console.log("token does not match");
        } else {
          //if they match (using correct/most recent forgot password email that was sent)
          //check if expired
          if (user.forgotPWToken.createdAt.expires <= new Date()) {
            res.json("token expired");
            console.log("token expired");
          } else {
            res.json("token not expired");
            console.log("token not expired");
          }
        }
      } else {
        res.json("no user");
      }
    });
});

//Resend Verification Link
app.post("/resend-verification-link", (req, res) => {
  console.log(req.body.email);
  let db_connect = dbo.getDb();

  db_connect
    .collection("picpocket-users")
    .findOne({ username: req.body.username }, function (err, user) {
      if (err) {
        console.log(err);
      } else if (user) {
        const transporter = nodemailer.createTransport({
          host: "smtp.zoho.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_SENDER_USER,
            pass: process.env.EMAIL_SENDER_PASS,
          },
        });

        //point to template folder
        const handlebarsOptions = {
          viewEngine: {
            partialsDir: path.resolve("./views/"),
            defaultLayout: false,
          },
          viewPath: path.resolve("./views/"),
        };

        //use template file
        transporter.use("compile", hbs(handlebarsOptions));

        const mailConfigurations = {
          // It should be a string of sender/server email
          from: "administrator@picpoccket.com",

          to: req.body.email,

          // Subject of Email
          subject: "PicPocket Email Verification",

          template: "email", //name of template file in views folder - email.handlebars

          context: {
            //variables to use in email.handlebars
            name: req.body.username,
            linkName: req.body.username.split(" ").join("-"),
            token: user.verifyToken,
          },

          // This would be the text of email body
          //   text: `Hi! There, You have recently visited
          //   our website and entered your email.
          //   Please follow the given link to verify your email
          //   localhost:3000/${req.body.username}/verify/${token}
          //   Thanks`,
        };

        transporter.sendMail(mailConfigurations, function (error, info) {
          if (error) {
            throw Error(error);
          } else {
            res.json("verification resent");
            console.log("Email Sent Successfully");
            console.log(info);
          }
        });
      }
    });
});

//Change Email
app.post("/change-email", (req, res) => {
  //validation
  if (!validator.isEmail(req.body.email)) {
    res.json("email is not valid");
    return;
  }

  let db_connect = dbo.getDb();

  //check if email already exists
  db_connect
    .collection("picpocket-users")
    .findOne({ email: req.body.email }, function (err, user) {
      if (err) {
        response.status(400).send("error");
        console.log("to array error");
      } else if (user) {
        res.json("email already exists");
        console.log("email already exists");
      } else {
        console.log("email is new");
        //check if password belongs to account making the change
        //find user with curUser username
        db_connect.collection("picpocket-users").findOne(
          {
            username: req.body.username,
          },
          async function (err, user) {
            if (err) {
              console.log(err);
              res.json("error");
            } else if (!user) {
              console.log("No user found.");
              res.json("No user found.");
            } else if (user) {
              //once found, compare the given password with the user's password hash
              const passwordMatch = await bcrypt.compare(
                req.body.password,
                user.password
              );
              if (!passwordMatch) {
                console.log("Incorrect password.");
                res.json("Incorrect password.");
              } else if (passwordMatch) {
                // async function updateEmail() {
                db_connect.collection("picpocket-users").updateOne(
                  {
                    username: req.body.username,
                  },
                  { $set: { email: req.body.email, verified: false } },
                  function (err, user) {
                    if (err) {
                      throw err;
                    } else if (user) {
                      console.log(user);
                    }
                    //send email with verification link to new email
                    db_connect
                      .collection("picpocket-users")
                      .findOne(
                        { username: req.body.username },
                        function (err, user) {
                          if (err) {
                            console.log(err);
                          } else {
                            const transporter = nodemailer.createTransport({
                              host: "smtp.zoho.com",
                              port: 465,
                              secure: true,
                              auth: {
                                user: process.env.EMAIL_SENDER_USER,
                                pass: process.env.EMAIL_SENDER_PASS,
                              },
                            });

                            const mailConfigurations = {
                              // It should be a string of sender/server email
                              from: "administrator@picpoccket.com",

                              to: req.body.email,

                              // Subject of Email
                              subject: "PicPocket Email Verification",

                              // This would be the text of email body
                              text: `Hi! There, You have recently visited
                  our website and entered your email.
                  Please follow the given link to verify your email
                  https://picpoccket.com/${req.body.username}/verify/${user.verifyToken}
                  Thanks`,
                            };

                            transporter.sendMail(
                              mailConfigurations,
                              function (error, info) {
                                if (error) {
                                  throw Error(error);
                                } else {
                                  console.log("Email Sent Successfully");
                                  console.log(info);
                                  res.json("email changed");
                                }
                              }
                            );
                          }
                        }
                      );
                  }
                );
                // }
              }
            }
          }
        );

        // updateEmail();
      }
    });
});

//Email Verification Link Verify
app.post("/:username/verify/:token", (req, res) => {
  //if :username is not signed in or another user is signed in already, bring them to sign in page to sign in
  //signing in removes all other tokens and signs that user in
  console.log("token page test");
  let db_connect = dbo.getDb();

  //if use params token is same as :username's token, set :username's verified status to true
  //and send response to tell react to render success page stuff
  db_connect.collection("picpocket-users").findOne(
    {
      $and: [{ username: req.body.username }, { verifyToken: req.body.token }],
    },
    function (err, user) {
      if (err) {
        console.log(err);
        res.json("error");
      } else if (user) {
        //if :username is already verified, don't do anything and just bring them to the home page
        if (user.verified == true) {
          res.json("already verified");
        } else {
          db_connect
            .collection("picpocket-users")
            .updateOne(
              { username: req.body.username },
              { $set: { verified: true } }
            );
          res.json("verified has been set to true");
        }
      }
      //if the token or name doesn't match, give fail page
      else {
        res.json("user does not match");
      }
    }
  );
});

// OAuth Sign In/Up For Facebook
app.post("/oauth/sign/facebook", (req, res) => {
  console.log(req.body);

  let db_connect = dbo.getDb();

  //if email already belongs to a normal type account, respond saying email is already in use
  db_connect
    .collection("picpocket-users")
    .findOne(
      { $and: [{ email: req.body.email }, { type: "normal" }] },
      function (err, user) {
        if (err) {
          console.log(err);
          res.json("error");
        } else if (user) {
          console.log("Email already in use by non-OAuth account.");
          res.json("Email already in use by non-OAuth account.");
          return;
        } else if (!user) {
          //if email is not already in use by a normal type account
          db_connect.collection("picpocket-users").findOne(
            //see if OAuth account already exists via email and username
            {
              $and: [
                { username: req.body.name },
                { email: req.body.email },
                { type: "OAuth" },
              ],
            },
            async function (err, user) {
              if (err) {
                console.log(err);
                res.send("err");
              }
              if (!user) {
                //if no user is found, sign up then sign in
                console.log("user is new");
                async function insertNew() {}
                db_connect.collection("picpocket-users").insertOne(
                  {
                    type: "OAuth",
                    username: req.body.name,
                    email: req.body.email,
                    verified: true,
                    bio: "",
                    pfp: "https://res.cloudinary.com/dtyg4ctfr/image/upload/v1674238936/PicPocket/default_purple_pfp_ibof5p.jpg",
                  },
                  function (err, user) {
                    if (err) {
                      throw err;
                    } else {
                      //create token to send in email verification link
                      const name = req.body.name;
                      const token = createToken(user.insertedId);
                      res.status(200).json({ name, token });
                    }
                    insertNew();
                  }
                );
              } else if (user) {
                // if user already exists, sign in
                console.log("success");
                const name = req.body.name;
                const token = createToken(user.insertedId);
                res.status(200).json({ name, token });
              }
            }
          );
        }
      }
    );
});

//OAuth Sign In/Up For GOOGLE
app.post("/oauth/sign/google", (req, res) => {
  console.log("oauth sign in google");
  console.log(req.body.data);
  let db_connect = dbo.getDb();

  //if email already belongs to a normal type account, respond saying email is already in use
  db_connect
    .collection("picpocket-users")
    .findOne(
      { $and: [{ email: req.body.data.email }, { type: "normal" }] },
      function (err, user) {
        if (err) {
          console.log(err);
          res.json("error");
        } else if (user) {
          console.log("Email already in use by non-OAuth account.");
          res.json("Email already in use by non-OAuth account.");
          return;
        } else if (!user) {
          //if email is not already in use by a normal type account
          db_connect.collection("picpocket-users").findOne(
            //see if OAuth account already exists via email and username
            {
              $and: [
                { username: req.body.data.name },
                { email: req.body.data.email },
                { type: "OAuth" },
              ],
            },
            async function (err, user) {
              if (err) {
                console.log(err);
                res.send("err");
              }
              if (!user) {
                //if no user is found, sign up then sign in
                console.log("user is new");
                async function insertNew() {}
                db_connect.collection("picpocket-users").insertOne(
                  {
                    type: "OAuth",
                    username: req.body.data.name,
                    email: req.body.data.email,
                    verified: true,
                    bio: "",
                    pfp: "https://res.cloudinary.com/dtyg4ctfr/image/upload/v1674238936/PicPocket/default_purple_pfp_ibof5p.jpg",
                  },
                  function (err, user) {
                    if (err) {
                      throw err;
                    } else {
                      //create token to send in email verification link
                      const name = req.body.data.name;
                      const token = createToken(user.insertedId);
                      res.status(200).json({ name, token });
                    }
                    insertNew();
                  }
                );
              } else if (user) {
                // if user already exists, sign in
                console.log("success");
                const name = req.body.data.name;
                const token = createToken(user.insertedId);
                res.status(200).json({ name, token });
              }
            }
          );
        }
      }
    );
});

//user sign in post
app.post("/SignIn", async (req, res) => {
  console.log("sign in");
  let db_connect = dbo.getDb();

  db_connect.collection("picpocket-users").findOne(
    //see if user exists via name and password
    {
      username: { $regex: req.body.username, $options: "i" },
    },
    async function (err, user) {
      if (err) {
        console.log(err);
        res.send("err");
      } else if (!user) {
        //if no user is found
        res.json("no user exists");
        console.log("no user exists.");
      } else {
        const passwordMatch = await bcrypt.compare(
          req.body.password,
          user.password
        );

        if (!passwordMatch) {
          console.log("no password matching");
          // res.status(404);
          res.json("no user exists");
        } else if (passwordMatch) {
          console.log("success");
          const name = user.username;
          const token = createToken(user.insertedId);
          res.status(200).json({ name, token });
        }
      }
    }
  );
});

// app.post("/SignOut", (req, res) => {
//   let db_connect = dbo.getDb();

//   db_connect
//     .collection("picpocket-users")
//     .updateMany(
//       { signedIn: true },
//       { $set: { signedIn: false } },
//       function (err, res) {
//         if (err) throw err;
//         console.log("signed out");
//       }
//     );
// });

app.post("/change-password", async (req, res) => {
  //password hashing
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.newPassword, salt);

  let db_connect = dbo.getDb();
  //check if user with req.body.username, req.body.oldPassword exists ->
  //if user with req.body.username, req.body.oldPassword exists ->
  //run passwordIsStrongEnoguh() from validaotr on req.body.newPassword ->
  //if passes, change password. if fails, send response "Password not strong enough"
  //if user does not exist, send response "Current password is incorrect"

  db_connect.collection("picpocket-users").findOne(
    {
      username: req.body.username,
    },
    async function (err, result) {
      const passwordMatch = await bcrypt.compare(
        req.body.currentPassword,
        result.password
      );
      if (err) {
        console.log(err);
      } else if (!passwordMatch) {
        res.json("incorrect current password");
      } else if (
        passwordMatch &&
        req.body.newPassword !== req.body.confirmNewPassword
      ) {
        res.json("New Password and Confirm New Password must match.");
      } else {
        if (
          validator.isStrongPassword(req.body.newPassword) &&
          req.body.newPassword !== req.body.currentPassword
        ) {
          db_connect.collection("picpocket-users").updateOne(
            {
              username: req.body.username,
            },
            {
              //change pfp to uploaded image
              $set: {
                password: hash,
              },
            }
          );
          res.json("change password");
        } else if (
          validator.isStrongPassword(req.body.newPassword) &&
          req.body.newPassword == req.body.currentPassword
        ) {
          res.json("new password cannot match current password");
        } else {
          res.json("password too weak");
        }
      }
    }
  );
});

//Reset Password (after forgot password)
app.post("/reset-password", async (req, res) => {
  //run isStrongPassword() from validator on req.body.newPassword ->
  //if passes, change password. if fails, send response "password too weak"

  //password hashing
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.newPassword, salt);

  //validation
  //if password is not strong enough, return
  if (!validator.isStrongPassword(req.body.newPassword)) {
    response.json("password too weak");
    return;
  }

  let db_connect = dbo.getDb();

  //if new password and confirm new password fields do not match
  if (req.body.newPassword !== req.body.confirmNewPassword) {
    res.json("New Password and Confirm New Password must match.");
  } else {
    //if password is strong and fields match
    db_connect.collection("picpocket-users").updateOne(
      {
        username: req.body.username,
      },
      {
        $set: {
          password: hash,
        },
      }
    );
    res.json("change password");
  }
});

//Contact
app.post("/contact", (req, res) => {
  console.log("contact");
  //validation
  if (!validator.isEmail(req.body.email)) {
    res.json("Email is not valid");
    return;
  }

  //send email
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_SENDER_USER,
      pass: process.env.EMAIL_SENDER_PASS,
    },
  });

  const mailConfigurations = {
    // It should be a string of sender/server email
    from: "administrator@picpoccket.com",

    to: "administrator@picpoccket.com",

    // Subject of Email
    subject: `Contact Email from ${req.body.name} at ${req.body.email}`,

    // This would be the text of email body
    text: req.body.message,
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) {
      // throw Error(error);
      res.status(400);
      console.log(error);
    } else {
      console.log("Email Sent Successfully");
      console.log(info);
      res.json("send message");
    }
  });
});

app.post("/submit-new-bio", (req, res) => {
  console.log(req.body);
  let db_connect = dbo.getDb();

  db_connect
    .collection("picpocket-users")
    .find({ username: req.body.username })
    .toArray((err, result) => {
      if (err) {
        res.status(400);
      } else if (result) {
        db_connect
          .collection("picpocket-users")
          .updateOne(
            { username: req.body.username },
            { $set: { bio: req.body.newBio } }
          );
        res.json("bio changed");
      }
    });
});

app.delete("/Account/:username/delUser/:pfpID", (req, res) => {
  let db_connect = dbo.getDb();

  let pfpID = "picpocket/" + req.params.pfpID;
  if (pfpID != "picpocket/default_purple_pfp_ibof5p") {
    cloudinary.uploader
      .destroy(pfpID, { invalidate: true })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  db_connect
    .collection("picpocket-users")
    .deleteOne({ username: req.params.username });

  db_connect
    .collection("picpocket-images")
    .deleteMany({ uploadedBy: req.params.username });

  db_connect
    .collection("picpocket-pfps")
    .deleteMany({ uploadedBy: req.params.username });

  res.json("deleted");

  console.log("account deleted " + req.params.username); //req.params.username is whatever is in the URL at the position of :username
});

//get user info (pfp, description)
app.get("/:username/info", (req, res) => {
  let db_connect = dbo.getDb();
  console.log("user info fetch");
  db_connect
    .collection("picpocket-users")
    .find({ username: req.params.username })
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } else if (result.length >= 1) {
        res.json(result);
        console.log("user found");
      } else if (result.length <= 0) {
        res.json("no user found");
        console.log("no user found");
      }
    });
});

//cloudinary routes
//get random images for main page

//get images when searching
app.get("/search/:searchQuery", (req, res) => {
  console.log(req.params.searchQuery);

  // cloudinary.api
  //   .resources({ tags: true, max_results: 100 })
  //   .then((result) => res.json(result.resources))
  //   .catch((error) => {
  //     console.log(error);
  //   });

  //uses regex options i to make it case insensitive and
  //if title contains any part of search query
  db_connect
    .collection("picpocket-images")
    .find({ title: { $regex: req.params.searchQuery, $options: "i" } })
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } else {
        res.json(result);
        console.log(result);
      }
    });
});

// localtunnel url script lt --local-host 127.0.0.1 --port 5000 --subdomain picpocket
//upload cloudinary test
//need to use Multer to handle form data. send formdata from react without json parse or stringinfy and no headers
app.post("/uploadTest", async (req, res) => {
  console.log(req.body);
  await fetch(`https://api.cloudinary.com/v1_1/dtyg4ctfr/upload`, {
    method: "POST",
    body: {
      file: req.body,
      upload_preset: "qpexpq57",
      folder: "picpocket",
    },
  })
    .then((result) => console.log(result))
    .catch((err) => {
      console.log(err);
    });
});

//My Likes GET
app.get("/:username/likes", (req, res) => {
  console.log("likes get");

  let db_connect = dbo.getDb();

  let result = db_connect
    .collection("picpocket-images")
    .find({ likedBy: req.params.username })
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

//My Pics GET
app.get("/:username/my-pics", (req, res) => {
  console.log("my pics get");
  console.log(req.params.username);

  let db_connect = dbo.getDb();

  db_connect
    .collection("picpocket-images")
    .find({ uploadedBy: req.params.username })
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } else {
        res.json(result);
      }
    });
});

//delete image
app.post("/deleteImage", (req, res) => {
  //delete from cloudinary
  cloudinary.uploader
    .destroy(req.body.public_id, { invalidate: true })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
  //delete from mongodb
  let db_connect = dbo.getDb();
  var myQuery = { public_id: req.body.public_id };
  db_connect
    .collection("picpocket-images")
    .deleteOne(myQuery, function (err, obj) {
      if (err) throw err;
      console.log("1 document deleted. Public Id = " + req.body.public_id);
    });
  return res.status(200).json({ result: true, msg: "file deleted" });
});

//mass delete images
app.post("/massDeleteImages", (req, res) => {
  console.log(req.body);
  console.log("mass delete req");
  //mass delete from cloudinary
  cloudinary.api
    .delete_resources(req.body, { invalidate: true })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });

  //mass delete from mongodb
  let queryArr = req.body;
  let db_connect = dbo.getDb();
  var myQuery = { public_id: { $in: queryArr } };
  db_connect
    .collection("picpocket-images")
    .deleteMany(myQuery, function (err, obj) {
      if (err) throw err;
      console.log("Many documents deleted " + obj);
    });
  return res.status(200).json({ result: true, msg: "files deleted" });
});

//mass download images
app.get("/massDownloadImages/:publicIDArr", (req, res) => {
  console.log("mass download");

  let publicIDArr = req.params.publicIDArr;

  result = cloudinary.utils.download_zip_url(
    { public_ids: publicIDArr.split(",") },
    { target_public_id: "PicPocketMyPics" }
  );
  res.json(result);
});

//update image info
app.put("/update/:username", async (req, res) => {
  console.log("update test");
  console.log(req.body);
  //get existing random number from public_id
  let p_id = req.body.public_id;
  //get existing random number from image being updated
  let existingRandomNumber = req.body.public_id.slice(p_id.length - 6);
  var mongoReplacement;
  //random 6 digit number to tag onto the public_id to allow images to be named the same thing but have different public_ids
  let randomNumber = Math.floor(100000 + Math.random() * 900000);
  //if name is being changed in update form
  if (
    req.body.public_id != `picpocket/${req.body.title}-${existingRandomNumber}`
  ) {
    //update in cloudinary
    await cloudinary.uploader
      .rename(
        req.body.public_id,
        `picpocket/${req.body.title}-${randomNumber}`,
        {
          invalidate: true,
        }
      )
      .then((result) => {
        mongoReplacement = result;
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    //if name is not being changed in update form
    await cloudinary.api
      .resources_by_ids([req.body.public_id])
      .then((result) => {
        mongoReplacement = result.resources[0];
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //update in MongoDB
  let db_connect = dbo.getDb();
  var myQuery = { public_id: req.body.public_id };

  mongoReplacement.colors = req.body.colors;
  mongoReplacement.likes = req.body.likes;
  mongoReplacement.likedBy = req.body.likedBy;
  mongoReplacement.uploadedBy = req.params.username;
  mongoReplacement.title = req.body.title;
  mongoReplacement.tags = req.body.tags;
  mongoReplacement.description = req.body.description;
  mongoReplacement.imageType = req.body.imageType;

  db_connect
    .collection("picpocket-images")
    .replaceOne(myQuery, mongoReplacement);

  //respond with new public id so modal in edit mode navigates to it after edit submit
  res.json(mongoReplacement.public_id);
});

//update likedBy
//add to likedBy
app.post("/addLikedBy/:assetID/:username", (req, res) => {
  let imgAssetID = req.params.assetID;
  let user = req.params.username;

  let db_connect = dbo.getDb();

  db_connect
    .collection("picpocket-images")
    .updateOne(
      { asset_id: imgAssetID },
      { $push: { likedBy: user }, $inc: { likes: 1 } }
    );

  console.log("add like");
  res.json("add like");
});

//remove from likedBy
app.post("/removeLikedBy/:assetID/:username", (req, res) => {
  let imgAssetID = req.params.assetID;
  let user = req.params.username;

  let db_connect = dbo.getDb();

  db_connect
    .collection("picpocket-images")
    .updateOne(
      { asset_id: imgAssetID },
      { $pull: { likedBy: user }, $inc: { likes: -1 } }
    );

  console.log("remove like");
  res.json("remove like");
});

//Image View Page Gets
app.get("/image/:public_id", (req, res) => {
  //searches for image with same public id as one in url
  let image = `picpocket/${req.params.public_id}`;
  let db_connect = dbo.getDb();

  db_connect
    .collection("picpocket-images")
    .find({ public_id: image })
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } else if (result.length >= 1) {
        res.json(result);
        console.log("image found");
      } else if (result.length <= 0) {
        res.json("no image found");
        console.log("no image found");
      }
    });
});

//MYPICS SORT ROUTES
//Most Recent Sort
app.get("/:username/:sort/:filter", (req, res) => {
  let sort = req.params.sort;
  let filter = req.params.filter;
  let user = req.params.username;

  ifSortIsXHelperFunction(sort);

  let db_connect = dbo.getDb();

  if (filter == "all-types") {
    db_connect
      .collection("picpocket-images")
      .aggregate([
        //use match to find only uploadedBy
        { $match: { uploadedBy: req.params.username } },
        //use $lookup to pull user info tied to image for profile pic on overlay
        {
          $lookup: {
            from: "picpocket-users",
            localField: "uploadedBy",
            foreignField: "username",
            as: "test",
          },
        },
      ])
      .sort(sortBy)
      // .limit(12)
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching listings!");
        } else {
          res.json(result);
          console.log(result);
        }
      });
  } else if (filter != "all-types") {
    db_connect
      .collection("picpocket-images")
      .aggregate([
        //use match to find only uploadedBy
        {
          $match: {
            $and: [{ uploadedBy: req.params.username }, { imageType: filter }],
          },
        },
        //use $lookup to pull user info tied to image for profile pic on overlay
        {
          $lookup: {
            from: "picpocket-users",
            localField: "uploadedBy",
            foreignField: "username",
            as: "test",
          },
        },
      ])
      // .find({ imageType: filter })
      .sort(sortBy)
      // .limit(12)
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching listings!");
        } else {
          res.json(result);
          console.log(result);
        }
      });
  }
});

//SEARCHQUERY SORT FILTER ROUTES
//Most Recent Sort
app.get("/search/:searchQuery/:sort/:filter", (req, res) => {
  let sort = req.params.sort;
  let filter = req.params.filter;

  ifSortIsXHelperFunction(sort);

  const objectId = ObjectId("63c03bab0ea2381b005e565b");

  console.log("search");

  let db_connect = dbo.getDb();
  //title or tag must match searchQuery. Uses collation strength 2 for case insensitive (OLD)
  //using search index imageTitleSearchIndex to search for title and tags individual words case insensitive
  if (filter == "all-types") {
    db_connect
      .collection("picpocket-images")
      .aggregate([
        {
          $search: {
            index: "imageTitleSearchIndex",
            text: {
              query: req.params.searchQuery,
              path: ["title", "tags"],
            },
          },
        },
        {
          $lookup: {
            from: "picpocket-users",
            localField: "uploadedBy",
            foreignField: "username",
            as: "test",
          },
        },
      ])
      .sort(sortBy)
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching listings!");
          console.log(err);
        } else {
          res.json(result);
          console.log(result);
        }
      });
  } else if (filter != "all-types") {
    db_connect
      .collection("picpocket-images")
      .aggregate([
        {
          $search: {
            index: "imageTitleSearchIndex",
            compound: {
              must: {
                text: {
                  query: req.params.searchQuery,
                  path: ["title", "tags"],
                },
              },
              filter: {
                text: {
                  path: "imageType",
                  query: filter,
                },
              },
            },
          },
        },
        {
          $lookup: {
            from: "picpocket-users",
            localField: "uploadedBy",
            foreignField: "username",
            as: "test",
          },
        },
      ])
      .sort(sortBy)
      // .limit(12)
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching listings!");
        } else {
          res.json(result);
          console.log(result);
        }
      });
  }
});

//LIKES SORT FILTER ROUTES
//Most Recent Sort
app.get("/:username/likes/:sort/:filter", (req, res) => {
  let sort = req.params.sort;
  let filter = req.params.filter;

  ifSortIsXHelperFunction(sort);

  let db_connect = dbo.getDb();

  if (filter == "all-types") {
    db_connect
      .collection("picpocket-images")
      .aggregate([
        //use match to find only uploadedBy
        { $match: { likedBy: req.params.username } },
        //use $lookup to pull user info tied to image for profile pic on overlay
        {
          $lookup: {
            from: "picpocket-users",
            localField: "uploadedBy",
            foreignField: "username",
            as: "test",
          },
        },
      ])
      .sort(sortBy)
      // .limit(12)
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching listings!");
        } else {
          res.json(result);
          console.log(result);
        }
      });
  } else if (filter != "all-types") {
    db_connect
      .collection("picpocket-images")
      .aggregate([
        //use match to find only uploadedBy
        {
          $match: {
            $and: [{ likedBy: req.params.username }, { imageType: filter }],
          },
        },
        //use $lookup to pull user info tied to image for profile pic on overlay
        {
          $lookup: {
            from: "picpocket-users",
            localField: "uploadedBy",
            foreignField: "username",
            as: "test",
          },
        },
      ])
      .sort(sortBy)
      // .limit(12)
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching listings!");
        } else {
          res.json(result);
          console.log(result);
        }
      });
  }
});

app.get("/most-recent-images", (req, res) => {
  let db_connect = dbo.getDb();
  console.log("testing");
  db_connect
    .collection("picpocket-images")
    .aggregate([
      //use $lookup to pull user info tied to image for profile pic on overlay
      {
        $lookup: {
          from: "picpocket-users",
          localField: "uploadedBy",
          foreignField: "username",
          as: "test",
        },
      },
    ])
    .sort({ created_at: -1 })
    // .limit(12)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } else {
        res.json(result);
        console.log(result);
      }
    });
});

//Most Popular Sort (Likes Descending)
app.get("/most-popular", (req, res) => {
  let db_connect = dbo.getDb();

  db_connect
    .collection("picpocket-images")
    .aggregate([
      //use $lookup to pull user info tied to image for profile pic on overlay
      {
        $lookup: {
          from: "picpocket-users",
          localField: "uploadedBy",
          foreignField: "username",
          as: "test",
        },
      },
    ])
    .sort({ likes: -1 })
    // .limit(12)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } else {
        res.json(result);
        console.log(result);
      }
    });
});
