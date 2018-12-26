import React from 'react';
import { Link } from 'react-router-dom';

const ButtonNewQuestion = () => {
  return(
    <Link to="/new-question">
      <button className="btn-new-question" type="button">
        Ask a Question
      </button>
    </Link>
  );
};

export default ButtonNewQuestion;
