const { validateToken } = require('../services/auth');

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    console.log('tokenCookieValue', tokenCookieValue);
    if (!tokenCookieValue) {
      return next();
    }
    try {
      console.log('eddwe3');
      const userPayload = validateToken(tokenCookieValue);
      console.log('userPayload', userPayload);
      req.user = userPayload;
    } catch (error) {
      console.log(error);
    }
    return next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
