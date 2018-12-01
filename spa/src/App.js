import React, { Component } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import './App.css';

class App extends Component {
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    /**
     * NOTE: Even though the frontend is blocking based on whether you are authenticated, the real protection
     * is that you can't call the backend without an access token which you don't have unless you are logged in.  Also
     * that access token will be restricted to only have the scopes you are allowed access to.
     */
    return (
      <div>
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Auth0 - React</a>
            </Navbar.Brand>
            <Button
              bsStyle="primary"
              className="btn-margin"
              onClick={this.goTo.bind(this, 'home')}
            >
              Home
            </Button>
            {
              !isAuthenticated() && (
                <Button
                  id="qsLoginBtn"
                  bsStyle="primary"
                  className="btn-margin"
                  onClick={this.login.bind(this)}
                >
                  Log In
                </Button>
              )
            }
            {
              isAuthenticated() && (
                <Button
                  id="qsSomethingBtn"
                  bsStyle="primary"
                  className="btn-margin"
                  onClick={this.goTo.bind(this, 'something')}
                >
                  Something
                </Button>
              )
            }
            { isAuthenticated() && (
                <Button
                  id="qsLogoutBtn"
                  bsStyle="primary"
                  className="btn-margin"
                  onClick={this.logout.bind(this)}
                >
                  Log Out
                </Button>
              )
            }
          </Navbar.Header>
        </Navbar>
      </div>
    );
  }
}

export default App;
