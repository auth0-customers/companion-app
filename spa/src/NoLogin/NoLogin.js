import React, { Component } from 'react';
import axios from 'axios';
import { CONFIG } from '../config-variables';

import loading from '../Callback/loading.svg';

class NoLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null
    };

    this.login = this.login.bind(this);

    document.addEventListener("mobile-login", this.login);
  }

  login(e) {
    console.log(e.detail); // Prints "Example of an event"
    axios.defaults.headers.common.Authorization = `Bearer ${e.detail.accessToken}`;
    axios.get(`${CONFIG.baseApiUrl}/userinfo`, { responseType: 'json' })
      .then((response) => {
        this.props.auth.setProfile(response.data.user, response.data.expires_at * 1000);
        this.props.history.replace('/home');
      })
      .catch((err) => this.setState({ error: `${err.message} and ${JSON.stringify(e)}` }));
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <div className="container">
        {
          isAuthenticated() && (
            <h4>
              You are logged in!
            </h4>
          )
        }
        {
          !isAuthenticated() && (
            <h4>
              Logging you in!
              <img src={loading} alt="loading"/>

              { this.state.error ? <span>{this.state.error}</span> : null }
            </h4>
          )
        }
      </div>
    );
  }
}

export default NoLogin;
