const validator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.json({
        status: "error",
        code: 404,
        message: error.message,
      });
      return;
    }
    next();
  };
};

module.exports = validator;
