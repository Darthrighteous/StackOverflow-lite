import { connect } from 'react-redux';

import Spinner from '../components/Common/Spinner';

const mapStateToProps = state => ({
  isLoading: state.global.isLoading,
});

export default connect(mapStateToProps)(Spinner);