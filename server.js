const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const USERS_FILE = path.join(__dirname, "users.json");

require('dotenv').config({ path: 'var.env' });
const users = require("./users");
var cors = require('cors');

const logError = error => {
    if (error != null) {
        console.error(error);
    }
};

app.set("port", process.env.PORT || 3030);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Cache-Control", "no-cache");
    next();
});

// app.get("/todos", (req, res) => {
//     try {
//         let jwtUser = users.authenticate(req);
//         fs.readFile(USERS_FILE, (err, data) => {
//             logError(err);
//             let users = JSON.parse(data);
//             res.json(Object.values(users[jwtUser.id].todos));
//         });
//     } catch (err) {
//         logError(err);
//     }
// });

// app.post("/todos", async (req, res) => {
//     let user = await users.reload(users.authenticate(req));
//     let newToDo = users.createToDo(user, req.body.text);
//     res.json(newToDo);
// });

app.delete("/todos/:id", async (req, res) => {
    var user = await users.reload(users.authenticate(req));
    let id = req.params.id;
    delete user.todos[id];
    users.updateUser(user);
});

app.put("/todos/:id", async (req, res) => {
    var user = await users.reload(users.authenticate(req));
    let id = req.params.id;
    let newToDo = user.todos[id];
    newToDo.status = req.body.status;
    users.updateToDo(user, user.todos[id]);
})

app.use('/login', require('./routes/login'));
app.use('/signup', require('./routes/signup'));
app.use('/todos', require('./routes/todos'));
app.use(cors());

async function start() {
    try {
        await mongoose.connect(
            "mongodb://127.0.0.1:27017/",
            { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
        );
        app.listen(app.get("port"), () => console.log("Server started: http://localhost:" + app.get("port") + "/"));
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1);
    }
}

start();
