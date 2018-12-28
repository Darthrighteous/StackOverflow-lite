import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { authAction } from '../../actions/authActions';

/**
 * Login component
 */
export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { logInRequest, history } = this.props;
    const { email, password } = this.state;
    const body = {
      email,
      password,
    };
    logInRequest('login', body, history);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    const { email, password } = this.state;
    return (
      <div className="main-content">
        <div className="auth-form-container">	
          <div className="header" />

          <div className="body">
            <form className="auth-form" onSubmit={this.handleSubmit}>	
              <input
                required
                onChange={this.handleChange}
                type="text"
                name="email"
                value={email}
                placeholder="Email"
              />
              <br />
              <input
                required
                onChange={this.handleChange}
                type="Password"
                name="password"
                value={password}
                placeholder="Password"
              />
              <br />
              <input
                type="submit"
                name="logInButton"
                value="Log In"
              />
              <br />
              <p>
                <Link to="/reset-password">
                  Forgot your password.
                </Link>
              </p>
            </form>
          </div>

          <div className="footer">
            <p>
              Dont have an account?&nbsp;
              <Link to="/signup">
                Sign up
              </Link>
            </p>		
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  logInRequest: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const mapActionsToProps = {
  logInRequest: authAction
};

export default connect(null, mapActionsToProps)(Login);