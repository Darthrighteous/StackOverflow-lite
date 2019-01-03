import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const ButtonPrimary = (props) => {
  const { link, label, colorBtn, colorTxt, onClick } = props;
  const btnStyle = {
    backgroundColor: colorBtn,
    color: colorTxt,
  };
  return((link) ? (
    <NavLink activeStyle={{ display: 'none' }} to={link}>
      <button type="button" onClick={onClick} style={btnStyle}>
        {label}
      </button>
    </NavLink>
    ) : (
      <button type="button" onClick={onClick} style={btnStyle}>
        {label}
      </button>
    )
  );
};

ButtonPrimary.propTypes = {
  link: PropTypes.string,
  label: PropTypes.string.isRequired,
  colorBtn: PropTypes.string.isRequired,
  colorTxt: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

ButtonPrimary.defaultProps = {
  link: null,
  onClick: null,
};

export default ButtonPrimary;