const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

/* SETUP */
const app = express();

let Todo = require('./models/todo.model');

/* MIDDLEWARE */
app.use(cors());
app.use(bodyParser.json());

/* MONGO CONNECTION */
mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB connection established successfully");
});

const todoRoutes = express.Router();
app.use('/todos', todoRoutes);

/* MAIN ROUTES */
app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

/* TODO ROUTES */
todoRoutes.route('/').get((req, res) => {
  console.log('GET findAll');

  Todo.find((err, todos) => {
    if (!err) {
      console.log(todos);
      res.status(200).json(todos);
    } else {
      console.log('ERROR: ', err);
      res.status(400).json(err);
    }
  });
});

todoRoutes.route('/:id').get((req, res) => {
  console.log('GET findById');

  let id = req.params.id;
  console.log('id: ', id);

  Todo.findById(id, (err, todo) => {
    if (!err) {
      console.log(todo);
      res.status(200).json(todo);
    } else {
      console.log('ERROR: ', err);
      res.status(400).send('Todo could not be retrieved');
    }
  });
});

todoRoutes.route('/').post((req, res) => {
  console.log('POST addTodo');

  let todo = new Todo(req.body);
  console.log('todo: ' + todo);

  todo.save((err) => {
    if (!err) {
      console.log(todo)
      res.status(200).json(todo);
    } else {
      console.log('ERROR: ', err);
      res.status(400).send('Todo could not be saved');
    }
  });
});

todoRoutes.route('/:id').delete((req, res) => {
  console.log('DELETE deleteById')

  let id = req.params.id;
  console.log('id: ', id);

  Todo.deleteOne({_id: id}, (err) => {
    if (!err) {
      console.log('SUCCESS')
      res.status(200).send('Todo deleted successfully');
    } else {
      console.log('ERROR: ', err);
      res.status(400).send('removing todo failed');
    }
  });
});

todoRoutes.route('/:id').put((req, res) => {
  console.log('PUT updateTodo')

  let id = req.params.id;
  console.log('id: ', id);

  Todo.findOneAndUpdate({_id: id}, req.body, (err, todo) => {
    if (!err) {
      console.log(todo);
      res.status(200).json(todo);
    } else {
      console.log('ERROR: ', err);
      res.status(400).send('update failed');
    }
  })
});

/* SET PORT */
const API_PORT = 3001;

/* LISTENER */
app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}...`));
