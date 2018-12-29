import jwt from 'jsonwebtoken';

const verifyToken = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const { token } = JSON.parse(user);

    return jwt.verify(token, process.env.SECRET, (err) => {
      if (err) return false;
      return true;
    });
  }
  return false;
};

export default verifyToken;
