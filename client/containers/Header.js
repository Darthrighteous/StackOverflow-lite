import { connect } from 'react-redux';

import Header from '../components/Header';
import { setLoggedIn } from '../actions/globalActions';

const mapStateToProps = state => ({
  loginStatus: state.global.isLoggedIn
});

const mapActionsToProps = {
  setLoggedIn,
};

export default connect(
  mapStateToProps,
  mapActionsToProps,
  null,
  { pure: false }
)(Header);
