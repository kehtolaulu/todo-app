const { Schema, model, Types } = require("mongoose");
const ToDoList = require("./ToDoList").schema;

const schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    toDoLists: [ToDoList]
});

module.exports = model("User", schema);
