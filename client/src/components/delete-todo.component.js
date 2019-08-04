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
          delete_status: res.data
        });
      })
      .catch(error => {
        console.log("ERROR: ", error);
        this.setState({
          delete_status: "Todo could not be deleted"
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
