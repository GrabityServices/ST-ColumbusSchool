// Helper function to generate random alphanumeric string
function generateProcessId(length = 7) {
  const chars = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const curr = new Date(Date.now());
  const year = curr.getFullYear();
  return "STC" + year.toString().slice(-2) + result;
}

module.exports = generateProcessId;
