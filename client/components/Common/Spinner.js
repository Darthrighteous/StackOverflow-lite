import React from 'react';
import PropTypes from 'prop-types';

const Spinner = (props) => {
  const { isLoading } = props;
  return (
    (isLoading) ? (
      <div className="spinner-overlay">
        <i className="fas fa-spinner fa-spin" />
      </div>
    ) : (null)
  );
};

Spinner.propTypes = {
  isLoading: PropTypes.bool.isRequired
};

export default Spinner;

