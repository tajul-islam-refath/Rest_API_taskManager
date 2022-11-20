const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.headers.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      status: "Unauthorized",
    });
  }

  let email = jwt.verify(token, "swttoken123456")["data"];
  req.email = email;
  next();
};
