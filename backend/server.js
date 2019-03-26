const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');


/* MIDDLEWARE */
app.use(cors());
app.use(bodyParser.json());

/* MONGO CONNECTION */
// mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
// const connection = mongoose.connection;
//
// connection.once('open', function() {
//     console.log("MongoDB database connection established successfully");
// });

/* ROUTES */
app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

/* SET PORT */
const API_PORT = process.env.PORT || 3001;

/* LISTENER */
app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}...`));
