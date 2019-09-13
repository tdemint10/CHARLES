import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

import CreateTodoDialog from './create-todo.component.js';

const Todo = props => (
  <TableRow key={props.todo.todo_name}>
    <TableCell>{props.todo.todo_name}</TableCell>
    <TableCell align="right">{props.todo.todo_description}</TableCell>
    <TableCell align="right">{props.todo.todo_category}</TableCell>
    <TableCell align="right">{props.todo.todo_priority}</TableCell>
    <TableCell align="right">
      <Button variant="outlined" href={"/edit/" + props.todo._id} color="primary" className="button">
        Edit
      </Button>
    </TableCell>
    <TableCell align="right">
      <Button variant="outlined" color="secondary" className="button" onClick={() => {props.deleteCallback(props.todo._id)}}>
        Delete
      </Button>
    </TableCell>
  </TableRow>
)

export default class TodosList extends Component {

  constructor(props) {
    super(props);

    this.state = {todos: []};
    this.deleteTodo = this.deleteTodo.bind(this);
  }

  componentDidMount() {
    this.findAll();
  }

  findAll() {
    axios.get('http://localhost:3001/todos')
      .then(res => {
        this.setState({ todos: res.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  deleteTodo(id) {
    axios.delete('http://localhost:3001/todos/' + id)
      .then(res => {
        this.findAll();
      })
      .catch(error => {
        console.log("ERROR: ", error);
        this.setState({
          delete_status: "Todo could not be deleted"
        });
      });
  }

  todoList() {
    return this.state.todos.map((currentTodo, i) => {
      return <Todo todo={currentTodo} deleteCallback={this.deleteTodo} key={i} />;
    });
  }

  render() {
    return (
      <Paper className="root">
        <br />
        <CreateTodoDialog />
        <br />
        <br />
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Category</TableCell>
              <TableCell align="right">Priority</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { this.todoList() }
          </TableBody>
        </Table>
      </Paper>
    )
  }
}
