const express = require("express");
const app = express();
require("dotenv").config({ path: "./config.env" });
const cors = require("cors");
const port = process.env.PORT || 5000;

//cloudinary image hosting
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const dbo = require("./db/conn");
const { response, json } = require("express");
const { ObjectID } = require("bson");
const { ObjectId } = require("mongodb");
const e = require("express");

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
app.get("/curUser", (req, res) => {
  db_connect = dbo.getDb();
  //see if any user has signedIn: true
  db_connect
    .collection("picpocket-users")
    .findOne({ signedIn: true }, function (err, user) {
      if (err) {
        console.log(err);
      }
      if (user) {
        console.log("user found");
        res.json(user.username); //send username in resopnse to react fetch
      }
    });

  db_connect
    .collection("picpocket-users")
    .findOne({ signedIn: true }, function (err, user) {
      if (err) {
        console.log(err);
      }
      if (!user) {
        console.log("user not found");
        res.json("none"); //send username in resopnse to react fetch
      }
    });
});
//sign up post
app.post("/users", (req, response) => {
  let db_connect = dbo.getDb();

  let tries = req.body.try;
  //get account of person you're signing up as
  let newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    bio: "",
    pfp: "https://res.cloudinary.com/dtyg4ctfr/image/upload/v1674238936/PicPocket/default_purple_pfp_ibof5p.jpg",
    signedIn: false,
  };
  //find any users already signed in and push them to another array to access it
  var cursor = db_connect
    .collection("picpocket-users")
    .find({ signedIn: true });
  var signedInArray;
  async function getArr() {
    signedInArray = [];
    await cursor.forEach((user) => {
      signedInArray.push(user);
    });
  }
  getArr();

  db_connect
    .collection("picpocket-users")
    .find({ username: req.body.username })
    .toArray(function (err, result) {
      if (err) {
        response.status(400).send("error");
        console.log("to array error");
      } else if (result.length > 1 && tries == null) {
        //check if user already exists
        console.log("Username already exists. Sign up failed.");
        // console.log(result);
      } else if (signedInArray.length > 0 && tries == null) {
        //see if anyone else is signed in
        response.sendStatus(500);
        console.log("another user is already signed in.");
      } else if (signedInArray.length > 0 && tries == 2) {
        console.log("settofalse");
        async function setToFalse() {
          //if pressing OK on are you sure box:
          //find user(s) that is signed in and sign it out
          await db_connect
            .collection("picpocket-users")
            .updateMany({ signedIn: true }, { $set: { signedIn: false } });

          //insertone as signedIn: true
          await db_connect.collection("picpocket-users").insertOne(
            {
              username: req.body.username,
              password: req.body.password,
              email: req.body.email,
              bio: "",
              pfp: "https://res.cloudinary.com/dtyg4ctfr/image/upload/v1674238936/PicPocket/default_purple_pfp_ibof5p.jpg",
              signedIn: true,
            },
            function (err, res) {
              if (err) throw err;
              response.json(res);
            }
          );
        }
        setToFalse();
      } else {
        //if user is new
        console.log("user is new");
        async function insertNew() {
          //insertone as signedIn: true
          await db_connect.collection("picpocket-users").insertOne(
            {
              username: req.body.username,
              password: req.body.password,
              email: req.body.email,
              bio: "",
              pfp: "https://res.cloudinary.com/dtyg4ctfr/image/upload/v1674238936/PicPocket/default_purple_pfp_ibof5p.jpg",
              signedIn: true,
            },
            function (err, res) {
              if (err) throw err;
              response.json(res);
            }
          );
        }
        insertNew();
      }
    });
});
//user sign in post
app.post("/SignIn", (req, res) => {
  let db_connect = dbo.getDb();

  db_connect.collection("picpocket-users").findOne(
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
        db_connect.collection("picpocket-users").updateOne(
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
    .collection("picpocket-users")
    .updateMany(
      { signedIn: true },
      { $set: { signedIn: false } },
      function (err, res) {
        if (err) throw err;
        console.log("signed out");
      }
    );
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
  console.log("SSSSS");
  db_connect
    .collection("picpocket-users")
    .find({ username: req.params.username })
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching user info!");
      } else {
        res.json(result);
        console.log(result);
        console.log("o");
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
//upload post
app.post("/upload", (req, res) => {
  let db_connect = dbo.getDb();
  //make sure it's working
  console.log("upload test start");
  console.log("upload test start");
  console.log(req.body);
  //insert them into MongoDB with a likes and uploaded by field added
  db_connect.collection("picpocket-images").insertOne(req.body);
  res.json("uploaded");
});

//upload pfp post
app.post("/upload/pfp/:username/:oldPFP", (req, res) => {
  //req.body.secure_url for new PFP src
  let oldPFPID = "picpocket/" + req.params.oldPFP;
  let db_connect = dbo.getDb();
  //make sure it's working
  console.log("upload test start");
  console.log("upload test start");
  console.log(req.body);

  //upload new PFP to mongoDb
  db_connect.collection("picpocket-pfps").insertOne(req.body);
  db_connect.collection("picpocket-users").updateOne(
    {
      username: req.params.username,
    },
    {
      //change pfp to uploaded image
      $set: {
        pfp: req.body.secure_url,
      },
    }
  );
  //delete old pfp from mongoDb

  db_connect.collection("picpocket-pfps").deleteOne({ public_id: oldPFPID });

  //delete old pfp from Cloudinary
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

  res.json("uploaded");
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

  var mongoReplacement;
  //if name is being changed in update form
  if (req.body.public_id != `picpocket/${req.body.title}`) {
    //update in cloudinary
    await cloudinary.uploader
      .rename(req.body.public_id, `picpocket/${req.body.title}`, {
        invalidate: true,
      })
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

  res.json("updated");
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
app.get("/image/:title", (req, res) => {
  console.log("get");
  let image = req.params.title;
  let db_connect = dbo.getDb();

  db_connect
    .collection("picpocket-images")
    .find({ title: image })
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } else {
        res.json(result);
        console.log(result);
      }
    });
});

//MYPICS SORT ROUTES
//Most Recent Sort
app.get("/:username/:sort/:filter", (req, res) => {
  let sort = req.params.sort;
  let filter = req.params.filter;
  let user = req.params.username;
  if (sort == "most-recent") {
    sortBy = { created_at: -1 };
  } else if (sort == "oldest") {
    sortBy = { created_at: 1 };
  } else if (sort == "aToz") {
    sortBy = { title: 1 };
  } else if (sort == "zToa") {
    sortBy = { title: -1 };
  } else if (sort == "leastLikes") {
    sortBy = { likes: 1 };
  } else if (sort == "mostLikes") {
    sortBy = { likes: -1 };
  }

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
  if (sort == "most-recent") {
    sortBy = { created_at: -1 };
  } else if (sort == "oldest") {
    sortBy = { created_at: 1 };
  } else if (sort == "aToz") {
    sortBy = { title: 1 };
  } else if (sort == "zToa") {
    sortBy = { title: -1 };
  } else if (sort == "leastLikes") {
    sortBy = { likes: 1 };
  } else if (sort == "mostLikes") {
    sortBy = { likes: -1 };
  }

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
  if (sort == "most-recent") {
    sortBy = { created_at: -1 };
  } else if (sort == "oldest") {
    sortBy = { created_at: 1 };
  } else if (sort == "aToz") {
    sortBy = { title: 1 };
  } else if (sort == "zToa") {
    sortBy = { title: -1 };
  } else if (sort == "leastLikes") {
    sortBy = { likes: 1 };
  } else if (sort == "mostLikes") {
    sortBy = { likes: -1 };
  }

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
