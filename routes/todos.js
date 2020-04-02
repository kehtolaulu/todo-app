const { Router } = require('express');
const router = Router();
const ToDo = require('../models/ToDo')
const auth = require('../middleware/auth')

require('dotenv').config({ path: 'var.env' });

router.get('', auth, async (req, res) => {
    try {
        let todos = await ToDo.find({ owner: req.user.userId });
        res.json(todos);
    } catch (e) {
        res.status(500).json({ message: "Something went wrong" })
    }
});

router.post('', auth, async (req, res) => {
    let date = Date.now();
    let status = "new";
    let text = req.body.text;
    let todo = new ToDo({
        text, status, date, owner: req.user.id
    })
    await todo.save()
    res.status(200).json({ todo })
});


// app.delete("/todos/:id", async (req, res) => {
//     var user = await users.reload(users.authenticate(req));
//     let id = req.params.id;
//     delete user.todos[id];
//     users.updateUser(user);
// });

// app.put("/todos/:id", async (req, res) => {
//     var user = await users.reload(users.authenticate(req));
//     let id = req.params.id;
//     let newToDo = user.todos[id];
//     newToDo.status = req.body.status;
//     users.updateToDo(user, user.todos[id]);
// })

module.exports = router;
