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

app.use("/login", require("./routes/login"));
app.use("/signup", require("./routes/signup"));
app.use("/todos", require("./routes/todos"));

app.use(cors());

async function start() {
    try {
        await mongoose.connect(
            "mongodb://127.0.0.1:27017/",
            { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
        );
        app.listen(app.get("port"), () => console.log("Server started: http://localhost:" + app.get("port") + "/"));
    } catch (e) {
        console.log("Server Error", e.message);
        process.exit(1);
    }
}

start();
