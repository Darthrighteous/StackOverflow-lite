import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const ButtonPrimary = (props) => {
  const { link, label, colorBtn, colorTxt, onClick } = props;
  const btnStyle = {
    backgroundColor: colorBtn,
    color: colorTxt,
  };
  return(
    <NavLink activeStyle={{ display: 'none' }} to={link}>
      <button type="button" onClick={onClick} style={btnStyle}>
        {label}
      </button>
    </NavLink>
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