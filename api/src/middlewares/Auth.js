const User = require("../models/User");

module.exports = {
  private: async (req, res, next) => {
   const token =
      req.body.token || req.query.token || req.headers["authorization"];

    if (!req.body.token && !req.query.token && !req.headers["authorization"]) {
      res.json({ notallowed: true });
      return;
    }

    if (token === "") {
      res.json({ notallowed: true });
      return
    }


    const user = await User.findOne({ token: token });

    if (!user) {
      return res.json({ notallowed: true });
    }

    next();
  },
  validate: (schema) => (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({ errors: error.erros });
    }
  },
};
