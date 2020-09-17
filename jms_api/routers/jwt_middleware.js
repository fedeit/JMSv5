const storage = require('node-persist');
const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhh';

const authMiddleware = function(req, res, next) {
  console.log('Time: ', Date())
  console.log('IP: ', req.headers['x-forwarded-for'] || req.connection.remoteAddress)
  console.log('Cookies: ', req.cookies)
  if (req.path !== "/login") {
    next();
    return;
  }
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
}
module.exports = authMiddleware;