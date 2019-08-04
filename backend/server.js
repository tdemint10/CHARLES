const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

let Todo = require('./models/todo.model');

/* MIDDLEWARE */
app.use(cors());
app.use(bodyParser.json());

/* MONGO CONNECTION */
mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

const todoRoutes = express.Router();
app.use('/todos', todoRoutes);

/* MAIN ROUTES */
app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

/* TODO ROUTES */
todoRoutes.route('/').get((req, res) => {
  console.log('LIST')
  Todo.find((err, todos) => {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});

todoRoutes.route('/:id').get((req, res) => {
  let id = req.params.id;
  Todo.findById(id, (err, todo) => {
    if (!err) {
      res.status(200).json(todo);
    } else {
      res.status(404).send('todo not found')
    }
  });
});

todoRoutes.route('/add').post((req, res) => {
  let todo = new Todo(req.body);
  todo.save()
    .then(todo => {
      res.status(200).json({'todo': 'todo added successfully'});
    })
    .catch(err => {
      res.status(400).send('adding new todo failed');
    });
});

todoRoutes.route('/:id').delete((req, res) => {
  let id = req.params.id;
  console.log('Server: DELETE');
  console.log(id);
  Todo.remove({_id: id}, (err) => {
    if (!err) {
      res.status(200).json({'todo': 'todo removed successfully'});
    } else {
      console.log(err);
      res.status(400).json('removing todo failed');
    }
  });
});

/* SET PORT */
const API_PORT = 3001;

/* LISTENER */
app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}...`));
