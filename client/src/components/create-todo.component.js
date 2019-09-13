import React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default function CreateTodoDialog() {

  const [open, setOpen] = React.useState(false);
  var state = {
    todo_name: '',
    todo_description: '',
    todo_category: '',
    todo_priority: ''
  }

  function onChangeTodoName(e) {
    state.todo_name = e.target.value;
  }

  function onChangeTodoDescription(e) {
    state.todo_description = e.target.value;
  }

  function onChangeTodoCategory(e) {
    state.todo_category = e.target.value;
  }

  function onChangeTodoPriority(e) {
    state.todo_priority = e.target.value;
  }

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function addTodo() {
    console.log('here0');
    axios.post('http://localhost:3001/todos/', state)
      .then(res => {
        console.log(res.data);
        window.location.reload();
      });

    state = {
      todo_name: '',
      todo_description: '',
      todo_category: '',
      todo_priority: ''
    }

    handleClose();
  }

  return (
    <div id="add-todo-dialog">
      <Button variant="contained" color="primary" className="button" align="right" onClick={handleClickOpen}>
        New
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth={true} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add New Todo</DialogTitle>
        <DialogContent>
          <TextField
            id="todo-name"
            fullWidth={true}
            label="Name"
            margin="normal"
            onChange={onChangeTodoName}
          /><br />
          <TextField
            id="todo-description"
            fullWidth={true}
            label="Description"
            margin="normal"
            onChange={onChangeTodoDescription}
          /><br />
          <TextField
            id="todo-category"
            fullWidth={true}
            label="Category"
            margin="normal"
            onChange={onChangeTodoCategory}
          /><br /><br /><br />
          <FormControl component="fieldset">
            <FormLabel component="legend">Priority</FormLabel>
            <RadioGroup
              aria-label="priority"
              name="priority"
            >
              <FormControlLabel value="low" control={<Radio />} onChange={onChangeTodoPriority} label="Low" />
              <FormControlLabel value="medium" control={<Radio />} onChange={onChangeTodoPriority} label="Medium" />
              <FormControlLabel value="high" control={<Radio />} onChange={onChangeTodoPriority} label="High" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={addTodo} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );

}
