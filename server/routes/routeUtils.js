/**
* Checks if a string is a number
* @param {string} value The string to be checked
* @returns {void}
*/
const isNum = value => (/^\d+$/).test(value);

/**
* @param {object} req The request
* @param {object} res The response
* @param {object} next Call to pass onto next middleware
* @returns {void}
*/
export const validateQId = (req, res, next) => {
  if (!isNum(req.params.questionId)) {
    res.status(400).json({
      status: 'failure',
      message: 'question Id must be a number',
    });
  } else {
    req.qId = req.params.questionId;
    next();
  }
};

/**
* @param {object} req The request
* @param {object} res The response
* @param {object} next Call to pass onto next middleware
* @returns {void}
*/
export const validateAId = (req, res, next) => {
  if (!isNum(req.params.answerId)) {
    res.status(400).json({
      status: 'failure',
      message: 'answer Id must be a number',
    });
  }
  req.aId = req.params.answerId;
  next();
};
