import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { signUpAction } from '../../actions/authActions';

/**
 * Sign up component
 */
export class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname : '',
      email: '',
      username: '',
      password: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { signUpRequest, history } = this.props;
    const { firstname, lastname, email, username, password } = this.state;
    const body = {
      firstname,
      lastname,
      email,
      username,
      password,
    };
    signUpRequest(body, history);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    const { firstname, lastname, email, username, password } = this.state;
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
                name="firstname"
                value={firstname}
                placeholder="First Name"
              />
              <br />
              <input
                required
                onChange={this.handleChange}
                type="text"
                name="lastname"
                value={lastname}
                placeholder="Last Name"
              />
              <br />
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
                type="text"
                name="username"
                value={username}
                placeholder="Display Name"
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
                name="signUpButton"
                value="Sign Up"
              />
              <br />
              <p>
                By creating an account you agree to our&nbsp;
                <Link to="/terms-and-privacy">
                  Terms & Privacy.
                </Link>
              </p>
            </form>
          </div>

          <div className="footer">
            <p>
              Already have an account?&nbsp;
              <Link to="/login">
                Log in
              </Link>
            </p>		
          </div>
        </div>
      </div>
    );
  }
}

Signup.propTypes = {
  signUpRequest: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const mapActionsToProps = {
  signUpRequest: signUpAction
};

export default connect(null, mapActionsToProps)(Signup);