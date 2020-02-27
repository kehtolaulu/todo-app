var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var TODOS_FILE = path.join(__dirname, 'todos.json');

app.set('port', (process.env.PORT || 3030));

// app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/todos', function(req, res) {
  fs.readFile(TODOS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/todos', function(req, res) {
  fs.readFile(TODOS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var todos = JSON.parse(data);
    var newTodo = {
      id: Date.now(),
      text: req.body.text,
    };
    todos.push(newTodo);
    fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.json(todos);
    });
  });
});

app.delete('/api/todos', function(req, res) {
  fs.readFile(TODOS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var todos = JSON.parse(data);
    todos = todos.filter(todo => todo.id !== req.body.id);
    fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.json(todos);
    });
  });
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
