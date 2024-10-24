// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const authenticate = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
  
//   if (!token) {
//     return res.status(401).json({ message: 'No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid token.' });
//     }

//     req.user = user; // Attach user information to the request
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Authentication failed.' });
//   }
// };

// module.exports = authenticate;


const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {

  // const logRequest = (req, res, next) => {
  //   console.log(`Incoming request: ${req.method} ${req.url}`);
  //   console.log('Request headers:', req.headers);
  //   console.log('Request body:', req.body);
  //   next(); // Call the next middleware or route handler
  // };


  const authHeader = req.headers.authorization;

  // Check if the Authorization header is present and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or incorrect format.' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token from the Bearer token

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find the user by ID in the database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = user; // Attach user information to the request
    next(); // Proceed to the next middleware or route handler

    const authHeader = req.headers.authorization;

  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed.' });
  }

};

module.exports = authenticate;
