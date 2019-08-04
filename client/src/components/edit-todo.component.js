import React, { Component } from 'react';
import axios from 'axios';

export default class EditTodo extends Component {

  constructor(props) {
    super(props);

    this.onChangeTodoName = this.onChangeTodoName.bind(this);
    this.onChangeTodoDescription = this.onChangeTodoDescription.bind(this);
    this.onChangeTodoCategory = this.onChangeTodoCategory.bind(this);
    this.onChangeTodoPriority = this.onChangeTodoPriority.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      todo_name: '',
      todo_description: '',
      todo_category: '',
      todo_priority: '',
      todo_completed: false
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3001/todos/' + this.props.match.params.id)
      .then(response => {
        this.setState({
          todo_name: response.data.todo_name,
          todo_description: response.data.todo_description,
          todo_category: response.data.todo_category,
          todo_priority: response.data.todo_priority,
          todo_completed: response.data.todo_completed
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onChangeTodoName(e) {
    this.setState({
      todo_name: e.target.value
    });
  }

  onChangeTodoDescription(e) {
    this.setState({
      todo_description: e.target.value
    });
  }

  onChangeTodoCategory(e) {
    this.setState({
      todo_category: e.target.value
    });
  }

  onChangeTodoPriority(e) {
    this.setState({
      todo_priority: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();

    console.log(`Form submitted:`);
    console.log(`Todo Name: ${this.state.todo_name}`);
    console.log(`Todo Description: ${this.state.todo_description}`);
    console.log(`Todo Category: ${this.state.todo_category}`);
    console.log(`Todo Priority: ${this.state.todo_priority}`);

    const updatedTodo = {
      todo_name: this.state.todo_name,
      todo_description: this.state.todo_description,
      todo_category: this.state.todo_category,
      todo_priority: this.state.todo_priority,
      todo_completed: this.state.todo_completed
    };

    axios.put('http://localhost:3001/todos/' + this.props.match.params.id, updatedTodo)
        .then(res => console.log(res.data));

    this.setState({
      todo_name: '',
      todo_description: '',
      todo_category: '',
      todo_priority: '',
      todo_completed: false
    })
  }

  render() {
    return (
        <div style={{marginTop: 10}}>
          <h3>Edit Todo</h3>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label>Name: </label>
              <input  type="text"
                      className="form-control"
                      value={this.state.todo_name}
                      onChange={this.onChangeTodoName}
                      />
            </div>
            <div className="form-group">
              <label>Description: </label>
              <input  type="text"
                      className="form-control"
                      value={this.state.todo_description}
                      onChange={this.onChangeTodoDescription}
                      />
            </div>
            <div className="form-group">
              <label>Category: </label>
              <input
                      type="text"
                      className="form-control"
                      value={this.state.todo_category}
                      onChange={this.onChangeTodoCategory}
                      />
            </div>
            <div className="form-group">
              <div className="form-check form-check-inline">
                <input  className="form-check-input"
                        type="radio"
                        name="priorityOptions"
                        id="priorityLow"
                        value="Low"
                        checked={this.state.todo_priority==='Low'}
                        onChange={this.onChangeTodoPriority}
                        />
                <label className="form-check-label">Low</label>
              </div>
              <div className="form-check form-check-inline">
                <input  className="form-check-input"
                        type="radio"
                        name="priorityOptions"
                        id="priorityMedium"
                        value="Medium"
                        checked={this.state.todo_priority==='Medium'}
                        onChange={this.onChangeTodoPriority}
                        />
                <label className="form-check-label">Medium</label>
              </div>
              <div className="form-check form-check-inline">
                <input  className="form-check-input"
                        type="radio"
                        name="priorityOptions"
                        id="priorityHigh"
                        value="High"
                        checked={this.state.todo_priority==='High'}
                        onChange={this.onChangeTodoPriority}
                        />
                <label className="form-check-label">High</label>
              </div>
            </div>

            <div className="form-group">
              <input type="submit" value="Update Todo" className="btn btn-primary" />
            </div>
          </form>
      </div>
    );
  }

}
