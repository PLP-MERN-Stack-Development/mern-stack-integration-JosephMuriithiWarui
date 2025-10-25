import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // Use a secret defined in your .env file
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

export default generateToken;