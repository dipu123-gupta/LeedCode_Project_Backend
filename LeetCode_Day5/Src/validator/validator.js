const validator = require("validator");

const validate = (data) => {
  const mandatoryField = ["firstName", "email", "password"];

  const isAllowed = mandatoryField.every((k) => Object.keys(data).includes(k));

  if (!isAllowed) throw new Error("some field is missing");

  if (!validator.isEmail(data.email)) {
    throw new Error("invalid Email");
  }

  if (!validator.isStrongPassword(data.password)) {
    throw new Error("invalid password");
  }
};

module.exports = validate;
