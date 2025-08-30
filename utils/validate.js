const validator = require("validator");
function validUser(data) {
  data.firstName = data.firstName.trim();
  data.lastName = data.lastName.trim();
  data.password = data.password.trim();
  data.email = data.email.trim();
  data.uniqId = data.uniqId.trim().toUpperCase();
  const regex = /^[A-Z0-9]{5}$/;
  let validate = false;
  const mandatoryField = [
    "firstName",
    "lastName",
    "password",
    "email",
    "uniqId",
  ];

  const IsAllowed = mandatoryField.every((k) => Object.keys(data).includes(k));
  if (!IsAllowed) throw new Error("Fields Missing");
  if (!validator.isEmail(data.email)) throw new Error("Invalid Email");

  if (!validator.isStrongPassword(data.password))
    throw new Error("Week Password");

  if (
    !(
      data.firstName.length >= 3 &&
      data.firstName.length <= 20 &&
      data.lastName.length >= 3 &&
      data.lastName.length <= 20 &&
      validator.isAlphanumeric(data.firstName) &&
      validator.isAlphanumeric(data.lastName)
    )
  )
    throw new Error(
      "Name should have at least 3 char and atmost 20 char without andy numeric char"
    );

  if (!regex.test(data.uniqId)) throw new Error("Not a valid Admin ID ");
  validate = true;
  return validate;
}

module.exports = validUser;
