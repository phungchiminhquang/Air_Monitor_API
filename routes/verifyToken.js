import jwt from "jsonwebtoken";

const verifyToken = function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access denied");

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send(err);
  }
};

export { verifyToken };
