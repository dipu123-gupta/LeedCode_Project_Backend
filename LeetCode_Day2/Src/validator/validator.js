const validates = require("validatorjs");

const validate = (data) => {
  mandatoryField = ["firstName", "email", "password"];

  const isAllowed = mandatoryField.every((k) => Object.keys(data).includes(k));

  if (!isAllowed) throw new Error("some field is missing");

  if (!validates.isEmail(data.email)) throw new Error("invalid Email");
  
  if (!validates.isStrongPassword(data.password))
    throw new Error("invalid password");
};

module.exports = validate;
