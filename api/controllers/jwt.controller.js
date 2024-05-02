const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  console.log(bearerHeader);
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;

    next();
  } else {
    res.status(401).json({
      error: "Token is not provided",
    });
  }
}

const verifyAdmin = async (req, res, next) => {
  // Call verifyToken function to extract token from headers

  verifyToken(req, res, () => {
    jwt.verify(req.token, "1234mmm", (err, authData) => {
      if (err) {
        res.status(403).json({
          error: "Forbidden",
        });
      } else {
        console.log(authData);
        if (authData.role === "admin") {
          next();
        } else {
          res.status(403).json({
            error: "Forbidden",
          });
        }
      }
    });
  });
};

module.exports = { verifyAdmin, verifyToken };
