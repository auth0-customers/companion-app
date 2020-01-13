import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { CONFIG } from '../config-variables';

class Something extends Component {
  constructor(props) {
    super(props);

    this.state = { user: this.props.auth.getUser() };
  }

  doSomething() {
    axios.post(`${CONFIG.baseApiUrl}/something`, { user_id: this.state.user }, { responseType: 'json' })
      .then((response) => this.setState({ message: 'Did Something', data: response.data }))
      .catch((err) => this.setState({ error: err.message }));
  }

  readSomething() {
    axios.get(`${CONFIG.baseApiUrl}/something`, { params: { user_id: this.state.user }, responseType: 'json' })
      .then((response) => this.setState({ message: 'Read Something', data: response.data }))
      .catch((err) => this.setState({ error: err.message }));
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    /**
     * NOTE: Even though the frontend is blocking based on whether you are authenticated, the real protection
     * is that you can't call the backend without an access token which you don't have unless you are logged in.
     */
    return (
      <div className="container">
        {
          isAuthenticated() && (
            <div>
              <Button
                id="qsDoSomethingBtn"
                bsStyle="primary"
                className="btn-margin"
                onClick={this.doSomething.bind(this)}
              >
                Do Something
              </Button>
              <Button
                id="qsReadSomethingBtn"
                bsStyle="primary"
                className="btn-margin"
                onClick={this.readSomething.bind(this)}
              >
                Read Something
              </Button>
              <div className={'row'}>
                <div className={'col-xs-12'}>
                  State: { JSON.stringify(this.state) }
                </div>
              </div>
            </div>
          )
        }
        {
          !isAuthenticated() && (
            <h4>
              You are not logged in! Please{' '}
              <a
                style={{ cursor: 'pointer' }}
                onClick={this.login.bind(this)}
              >
                Log In
              </a>
              {' '}to continue.
            </h4>
          )
        }
      </div>
    );
  }
}

export default Something;
