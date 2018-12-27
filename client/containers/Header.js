import { connect } from 'react-redux';

import Header from '../components/Header';

const mapStateToProps = state => ({
  loginStatus: state.global.isLoggedIn
});

export default connect(mapStateToProps, null, null, { pure: false })(Header);