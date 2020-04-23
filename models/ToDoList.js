const { Schema, model } = require("mongoose");
const ToDo = require("./ToDo").schema;

const schema = new Schema({
    title: { type: String, required: true },
    toDos: [ToDo]
});

module.exports = model("ToDoList", schema);
