import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import ButtonPrimary from '../Common/ButtonPrimary';
import verifyToken from '../../utils/verifyToken';
import Toaster from '../../utils/Toaster';

/**
 * Header component
 */
class Header extends Component {
  constructor(props) {
    super(props);

    this.handleLogOut = this.handleLogOut.bind(this);
  }

  componentDidMount() {
    const { setLoggedIn } = this.props;
    if(verifyToken()) {
      setLoggedIn(true);
    }
  }

  handleLogOut() {
    const { setLoggedIn } = this.props;
    localStorage.removeItem('user');

    setLoggedIn(false);
    Toaster.success('successfully logged out', 'Goodbye');
  }

  render() {
    const { loginStatus } = this.props;
    const user = JSON.parse(localStorage.getItem('user'));
    return (
      <header>
        <div className="header-content">
          <div className="title-search-cont">
            <Link to="/">
              <div className="title">
                <i className="fab fa-stack-overflow" />
                <span>stackoverflow-lite</span>
              </div>
            </Link>
            
            <form className="search-form">
              <Link to="/search">
                <i className="fas fa-search" />
              </Link>
              <input
                id="search-bar"
                type="text"
                name="search"
                placeholder="Search all questions..."
              />
            </form>
          </div>

          <div className="user-options-cont">
            {(loginStatus) ? (
              <div className="user-options">
                <Link to={`/profile/${user.username}`}>
                  <i className="fas fa-user-circle" />
                </Link>
                <ButtonPrimary
                  label="Log Out"
                  colorTxt="#3275c3"
                  colorBtn="#ebf4ff"
                  onClick={this.handleLogOut}
                />
              </div>
              ) : (
                <div className="guest-options">
                  <ButtonPrimary
                    link="/login"
                    label="Log In"
                    colorTxt="#3275c3"
                    colorBtn="#ebf4ff"
                  />
                  <ButtonPrimary
                    link="/signup"
                    label="Sign Up"
                    colorTxt="#fff"
                    colorBtn="#3275c3"
                  />
                </div>
              )
            }
          </div>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  loginStatus: PropTypes.bool.isRequired,
  setLoggedIn: PropTypes.func.isRequired,
};

export default Header;
