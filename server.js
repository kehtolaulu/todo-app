const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config({ path: "var.env" });

app.set("port", process.env.PORT || 3030);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("./middleware/cors"));

app.use("/login", require("./routes/logIn"));
app.use("/signup", require("./routes/signUp"));
app.use("/todos", require("./routes/toDos"));
app.use("/todo_lists", require("./routes/toDoLists"));

app.use(cors());

async function start() {
    await mongoose.connect(
        "mongodb://127.0.0.1:27017/todo",
        { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
    );
    app.listen(app.get("port"), () => console.log(`Server started: http://localhost:${app.get("port")}/`));
}

start();
