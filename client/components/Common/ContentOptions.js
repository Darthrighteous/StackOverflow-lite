import React from 'react';
import PropTypes from 'prop-types';

const ContentOptions = (props) => {
  const {
    title, sort, dropdownOpenState, onDropdownClick, onSortClick, background
  } = props;
  return (
    <div className="content-options" style={(background) ? { background: '#f5f5f5' } : null}>
      <h4>{title}</h4>
      <div role="button" tabIndex="0" onKeyDown={null} className="dropdown" onClick={onDropdownClick}>
        <span className="dropdown-title">Sort</span>
        <div className="dropdown-container">
          <button type="button" className="drop-btn">{sort}</button>
          <svg className="drop-icon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path fill="inherit" d="M14.1711599,9.3535 L9.99925636,13.529 L5.82735283,9.3535 C5.51262415,9.0385 5.73543207,8.5 6.18054835,8.5 L13.8179644,8.5 C14.2630807,8.5 14.4858886,9.0385 14.1711599,9.3535" />
            </g>
          </svg>
        </div>

        {(dropdownOpenState) ? (
          <div className="dropdown-content">
            <button
              type="button"
              className="dropdown-item active"
              onClick={onSortClick.bind(this, 'most recent')}
            >
              Most Recent
            </button>

            <button
              type="button"
              className="dropdown-item"
              onClick={onSortClick.bind(this, 'most answered')}
            >
              Most Answered
            </button>

            <button
              type="button"
              className="dropdown-item"
              onClick={onSortClick.bind(this, 'most rated')}
            >
              Most Rated
            </button>
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>);
};

ContentOptions.propTypes = {
  sort: PropTypes.string.isRequired,
  title: PropTypes.string,
  background: PropTypes.bool,
  dropdownOpenState: PropTypes.bool.isRequired,
  onDropdownClick: PropTypes.func.isRequired,
  onSortClick: PropTypes.func.isRequired
};

ContentOptions.defaultProps = {
  title: '',
  background: false,
};

export default ContentOptions;