const express = require("express");
const app = express();
require("dotenv").config({ path: "./config.env" });
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const dbo = require("./db/conn");
const { response } = require("express");

app.get("/", (req, res) => {
  res.send("ok");
});

app.listen(port, () => {
  dbo.connectToServer((err) => {
    if (err) console.log(err);
  });
  console.log("server has connected.");
});

app.get("/users", (req, res) => {
  let db_connect = dbo.getDb();

  db_connect
    .collection("mern-ecommerce-users")
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
app.get("/curUser", (req, res) => {
  db_connect = dbo.getDb();
  //see if any user has signedIn: true
  db_connect
    .collection("mern-ecommerce-users")
    .findOne({ signedIn: true }, function (err, user) {
      if (err) {
        console.log(err);
      }
      if (user) {
        console.log("user found");
        res.json(user.username); //send username in resopnse to react fetch
      }
    });
});
//sign up post
app.post("/users", (req, response) => {
  let db_connect = dbo.getDb();

  let tries = req.body.try;

  let newUser = {
    username: req.body.username,
    password: req.body.password,
    signedIn: true,
  };

  let alreadySignedInArr = [];
  //find any users already signed in and push them to another array to access it
  db_connect
    .collection("mern-ecommerce-users")
    .find({ signedIn: true })
    .toArray(function (err, user) {
      for (let i = 0; i < user.length; i++) {
        alreadySignedInArr.push(1);
        console.log(user);
      }
    });
  alreadySignedInArr.push(1);
  console.log(alreadySignedInArr);

  db_connect
    .collection("mern-ecommerce-users")
    .find({ username: req.body.username })
    .toArray(function (err, result) {
      if (err) {
        response.status(400).send("error");
        console.log("to array error");
      } else if (result.length > 0 && tries == null) {
        //check if user already exists
        console.log("Username already exists. Sign up failed.");
      } else if (anyOtherSignedIn[0] > 0 && tries == null) {
        //see if anyone else is signed in
        response.sendStatus(500);
        console.log("another user is already signed in.");
      } else if (anyOtherSignedIn[0] > 0 && tries == 2) {
        //if pressing OK on are you sure box:
        //find user that is signed in and sign it out
        // console.log(anyOtherSignedIn);
        alreadySignedInArr.forEach((user) => {
          user.signedIn = false;
        });
        // console.log(anyOtherSignedIn);
        //insertone as signed in is true
        db_connect
          .collection("mern-ecommerce-users")
          .insertOne(newUser, function (err, res) {
            if (err) throw err;
            response.json(res);
          });
      } else {
        //if user is new
        console.log("user is new");
        db_connect
          .collection("mern-ecommerce-users")
          .insertOne(newUser, function (err, res) {
            if (err) throw err;
            response.json(res);
          });
      }
    });
});
//user sign in post
app.post("/SignIn", (req, res) => {
  let db_connect = dbo.getDb();

  db_connect.collection("mern-ecommerce-users").findOne(
    //see if user exists via name and password
    {
      username: req.body.username,
      password: req.body.password,
    },
    function (err, user) {
      if (err) {
        res.send("err");
      }
      if (!user) {
        //if no user is found
        res.sendStatus(404);
        console.log("no user exists.");
      }
      if (user.signedIn === true) {
        //if user is already signed in
        console.log("user already signed in");
        res.sendStatus(500);
      } else if (user.signedIn === false) {
        console.log("success");
        res.send({ "signed in": "yes" });
        db_connect.collection("mern-ecommerce-users").updateOne(
          {
            username: req.body.username,
            password: req.body.password,
            signedIn: false,
          },
          {
            //change signedIn to true
            $set: {
              username: req.body.username,
              password: req.body.password,
              signedIn: true,
            },
          }
        );
      }
    }
  );
});

app.post("/SignOut", (req, res) => {
  let db_connect = dbo.getDb();

  db_connect
    .collection("mern-ecommerce-users")
    .updateOne(
      { signedIn: true },
      { $set: { signedIn: false } },
      function (err, res) {
        if (err) throw err;
        console.log("signed out");
      }
    );
});

app.delete("/Account/:username/delUser", (req, res) => {
  let db_connect = dbo.getDb();
  db_connect
    .collection("mern-ecommerce-users")
    .deleteOne({ username: req.params.username });

  console.log("account deleted " + req.params.username); //req.params.username is whatever is in the URL at the position of :username
});
