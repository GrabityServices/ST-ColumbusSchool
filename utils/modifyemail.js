async function modifiedemail(email) {
  if (typeof email !== "string" || !email.includes("@")) {
    return email; // invalid email format, return as-is
  }

  const [user, domain] = email.split("@");

  // Edge cases: username too short
  if (user.length <= 1) {
    return `*@${domain}`;
  }
  if (user.length <= 4) {
    // For usernames 2–4 chars, keep first, last char
    const first = user[0];
    const last = user[user.length - 1];
    const stars = "*".repeat(user.length - 2);
    return `${first}${stars}${last}@${domain}`;
  }

  // Normal case: keep first 1 char + last 3 chars
  const first = user[0];
  const last3 = user.slice(-3);
  const middleStars = "*".repeat(user.length - 4);

  return `${first}${middleStars}${last3}@${domain}`;
}

module.exports = modifiedemail;

