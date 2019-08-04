import React, { Component } from 'react';
import axios from 'axios';

export default class DeleteTodo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      delete_status: ''
    }
  }

  componentDidMount() {
    axios.delete('http://localhost:3001/todos/' + this.props.match.params.id)
      .then(res => {
        this.setState({
          delete_status: res.data.todo
        });
      })
      .catch(function (error) {
        console.log(error);
        this.setState({
          delete_status: "Delete unsuccessful"
        });
      });
  }

  status() {
    return this.state.delete_status;
  }

  render() {
    return (
      <div>
        <p>{ this.status() }</p>
      </div>
    )
  }

}
