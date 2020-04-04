const { Router } = require("express");
const ToDo = require("../models/ToDo");
const auth = require("../middleware/auth");

const router = Router();

router.get("", auth, async (req, res) => {
    try {
        let todos = await ToDo.find({ owner: req.user.userId });
        res.json(todos);
    } catch (e) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

router.post("", auth, async (req, res) => {
    let date = Date.now();
    let status = "new";
    let text = req.body.text;
    let todo = new ToDo({
        text, status, date, owner: req.user.userId
    });
    await todo.save();
    res.status(200).json({ todo });
});

router.delete("/:id", auth, async (req, res) => {
    await ToDo.deleteOne({ _id: req.params.id });
    res.status(200);
});

router.put("/:id", auth, async (req, res) => {
    await ToDo.updateOne({ _id: req.params.id }, { status: req.body.status});
    res.status(200);
});

module.exports = router;
