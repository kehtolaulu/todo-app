const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const jwt = require("jsonwebtoken");

const USERS_FILE = path.join(__dirname, "users.json");

require('dotenv').config({ path: 'var.env' });
const users = require("./users");

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

app.get("/todos", (req, res) => {
    try {
        let jwtUser = users.authenticate(req);
        fs.readFile(USERS_FILE, (err, data) => {
            logError(err);
            let users = JSON.parse(data);
            res.json(Object.values(users[jwtUser.id].todos));
        });
    } catch (err) {
        logError(err);
    }
});

app.post("/todos", async (req, res) => {
    let user = await users.reload(users.authenticate(req));
    let newToDo = users.createToDo(user, req.body.text);
    res.json(newToDo);
});

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

app.post("/login", async (req, res) => {
    let { username, password } = req.body;
    let user = await users.findUser(username);
    if (user && user.password == password) {
        jwt.sign({ id: user.id, username: user.username },
            process.env.PRIVATE_KEY,
            (err, token) => {
                if (err) {
                    res.status(401).send(err);
                } else {
                    res.json({ token: token });
                }
            }
        );
    } else {
        res.status(401).send({ error: 'Something\'s wrong!' });
    }
});

app.listen(app.get("port"), () => {
    console.log("Server started: http://localhost:" + app.get("port") + "/");
});
