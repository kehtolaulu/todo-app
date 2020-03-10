const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const TODOS_FILE = path.join(__dirname, 'todos.json');

const logError = error => {
  if (error != null) {
    console.error(error);
  }
};

app.set('port', (process.env.PORT || 3030));

// app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.get('/api/todos', (req, res) => {
  fs.readFile(TODOS_FILE, (err, data) => {
    logError(err);
    res.json(JSON.parse(data));
  });
});

app.post('/api/todos', (req, res) => {
  fs.readFile(TODOS_FILE, (err, data) => {
    if (err) {
      console.error(err);
      throw new Error();
    }
    let todos = JSON.parse(data);
    let newTodo = {
      id: Date.now(),
      text: req.body.text,
    };
    todos.push(newTodo);
    fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 4), logError);
    res.json(newTodo);
  });
});

app.delete('/api/todos/:id', (req, res) => {
  let id = parseInt(req.params.id);
  fs.readFile(TODOS_FILE, (err, data) => {
    logError(err);
    let todos = JSON.parse(data);
    todos = todos.filter(todo => todo.id !== id);
    fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 4), logError);
  });
});

app.listen(app.get('port'), () => {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
