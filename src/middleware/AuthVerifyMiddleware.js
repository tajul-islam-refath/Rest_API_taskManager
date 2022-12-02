const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
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
  } catch (err) {
    res.status(500).json({
      success: "fail",
      data: err,
    });
  }
};
