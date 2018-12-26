import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ButtonPrimary = (props) => {
  const { link, label, colorBtn, colorTxt, onClick } = props;
  const btnStyle = {
    backgroundColor: colorBtn,
    color: colorTxt,
  };
  return(
    <Link to={link}>
      <button type="button" onClick={onClick} style={btnStyle}>
        {label}
      </button>
    </Link>
  );
};

ButtonPrimary.propTypes = {
  link: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  colorBtn: PropTypes.string.isRequired,
  colorTxt: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

ButtonPrimary.defaultProps = {
  onClick: null,
};

export default ButtonPrimary;