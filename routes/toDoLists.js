const { Router } = require("express");
const User = require("../models/User");
const ToDoList = require("../models/ToDoList");
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

module.exports = router;
