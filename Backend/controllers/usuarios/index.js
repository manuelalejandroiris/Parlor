const newUser = require("./newUser");
const validateUser = require("./validateUser");
const loginUser = require("./loginUser");
const getUser = require("./getUser");
const deleteUser = require("./deleteUser");
const editUser = require("./editUser");
const editUserPassword = require("./editUserPassword");
const recoverUserPassword = require("./recoverUserPassword");
const resetUserPassword = require("./resetUserPassword");

module.exports = {
  newUser,
  validateUser,
  loginUser,
  getUser,
  deleteUser,
  editUser,
  editUserPassword,
  recoverUserPassword,
  resetUserPassword,
};
