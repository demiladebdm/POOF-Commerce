const errorHandler = (err, req, res, next) => {
  if(err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: "User is not Authenticated" })
  }

  if (err.name === "ValidationError") {
    return res.status(401).json({ message: err });
  }

  return res.status(500).json({ error: err })
};

const invalidPathHandler = (req, res, next) => {
  let error = new Error("Invalid Path");
  error.statusCode = 404;
  next(error);
};


module.exports = { errorHandler, invalidPathHandler };