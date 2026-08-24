const { validationResult } = require("express-validator");
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  req.flash(
    "error",
    errors
      .array()
      .map((e) => e.msg)
      .join(" "),
  );
  return res.redirect(req.get("referer") || "/");
};
