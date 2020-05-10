const { isUuid } = require("uuidv4");
module.exports = (req, res, next) => {
  const { id } = req.params;
  if (!isUuid(id)) {
    return res.status(401).json({ error: "Invalid repository ID" });
  }
  return next();
};
