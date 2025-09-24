function getCurrentDateTime() {
  const now = new Date();

  // Convert to India Standard Time (IST)
  return now.toLocaleString("en-GB", { 
    timeZone: "Asia/Kolkata", 
    hour12: false 
  }).replace(",", "");
}

module.exports = getCurrentDateTime;
