const { Router } = require("express");
const User = require("../models/User");
const ToDoList = require("../models/ToDoList");
const ToDo = require("../models/ToDo");
const auth = require("../middleware/auth");

const router = Router();

router.get("", auth, async (req, res) => {
    try {
        let user = await User.findOne({ username: req.user.username });
        let toDoLists = user.toDoLists;
        res.json(toDoLists);
    } catch (e) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

router.get("/:id/todos", auth, async (req, res) => {
    try {
        let toDoList = await ToDoList.findOne({ _id: req.params.id });
        res.json(toDoList.toDos);
    } catch (e) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

router.post("/:id/todos", auth, async (req, res) => {
    try {
        let toDoList = await ToDoList.findOne({ _id: req.params.id });
        let date = Date.now();
        let status = "new";
        let text = req.body.text;
        let todo = new ToDo({
            text, status, date, owner: req.user.userId
        });
        await todo.save();
        toDoList.toDos.push(todo);
        toDoList.save();
        res.status(200).json({ todo });
    } catch (e) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

module.exports = router;
