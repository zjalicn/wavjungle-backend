//Require
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

//MongoDB login
const uri =
"mongodb+srv://nzjalic:wfLaWpPqpYzgCbGW@cluster0-vyn5n.mongodb.net/test";

const corsOptions = {
  origin: 'https://nzjalic-ecommerce.herokuapp.com',
  optionsSuccessStatus: 200
}

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

const port = process.env.PORT || 5000;
//Express
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, "client/build")))

io.on("connection", socket => {
  console.log("Socket.io connected");
});

//END POINTS
app.get("/api/getProducts", (req, res) => {
  MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
    if (err) {
      console.log("Error connecting to Mongo Atlas");
    } else {
      console.log("Connected");
      client
        .db("ecommerce-db")
        .collection("products")
        .find()
        .toArray(function(err, data) {
          res.send(data);
        });
      client.close();
    }
  });
});

app.get("/api/getNewestProducts", (req, res) => {
  MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
    if (err) {
      console.log("Error connecting to Mongo Atlas");
    } else {
      console.log("Connected");
      client
        .db("ecommerce-db")
        .collection("products")
        .find()
        .limit(4)
        .toArray(function(err, data) {
          res.send(data);
        });
      client.close();
    }
  });
});

app.get("/api/plp/:pid", function(req, res) {
  MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
    if (err) {
      console.log("Error connecting to Mongo Atlas");
    } else {
      console.log("Connected");
      client
        .db("ecommerce-db")
        .collection("products")
        .find({ id: `${req.params.pid}` })
        .limit(1)
        .toArray(function(err, data) {
          res.send(data);
        });
      client.close();
    }
  });
});
/*
TO DO 

app.post("/api/users/authentication/", function(req, res) {
  MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
    if (err) {
      console.log("Error connecting to Mongo Atlas");
    } else {
      console.log("Connected");
      console.log(req.body.body);
      client
      .db("ecommerce-db")
      .collection("users")
      .find(req.body.body) 
      .toArray(function(err, data){
        data.map(user => 
            console.log(user)
        )
      });
/*
      if (filteredUsers.length) { //true if not 0
        // if login details are valid return user details and fake JSON Web Token
        let user = filteredUsers[0];
        let responseJson = {
          id: user._id,
          username: user.username,
          token: "jwt-token"
        };
        resolve({
          ok: true,
          text: () => Promise.resolve(JSON.stringify(responseJson))
        });
      } else {
        reject("Username or password is incorrect");
      }
      
      return;
  }
      /*
      client
        .db("ecommerce-db")
        .collection("users")
        .find({
          email: `${req.body.body.username}`
        })
        .toArray(function(err, data) {
          console.log(data);
          res.send(data);
        });
      }
  )});
*/

server.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
