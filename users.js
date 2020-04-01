const path = require("path");
const util = require("util");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.PRIVATE_KEY;
const USERS_FILE = path.join(__dirname, "users.json");

const readFile = util.promisify(fs.readFile);

const findAllUsers = async() => JSON.parse(await readFile(USERS_FILE));

const saveUsers = (users) => {
    fs.writeFile(USERS_FILE, JSON.stringify(users, null, 4), console.log);
};

const authenticate = (request) => {
    return jwt.verify(request.headers['authorization'], jwtSecret);
};

const reload = async(user) => {
    let users = await findAllUsers();
    Object.assign(user, users[user.id]);
    return user;
};

const findUser = async(username) => {
    let users = await findAllUsers();
    for (let userId in users) {
        if (users[userId].username === username) {
            return users[userId];
        }
    }
};

const updateUser = async(user) => {
    let users = await findAllUsers();
    users[user.id] = user;
    saveUsers(users);
};

const createToDo = (user, text) => {
    let newToDo = {
        id: Date.now(),
        text: text,
        status: "new"
    };
    user.todos[newToDo.id] = newToDo;
    updateUser(user);
    return newToDo;
}

const updateToDo = (user, todo) => {
    user.todos[todo.id] = todo;
    updateUser(user);
    return todo;
}

module.exports = { findUser, updateUser, reload, authenticate, createToDo, updateToDo };