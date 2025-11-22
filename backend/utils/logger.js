const fs = require("fs");
const path = require("path");

const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const log = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;

  const logObject = {
    timestamp,
    level,
    message,
    data,
  };

  // Console output
  console.log(`${logMessage}`, data);

  // File output
  const logFile = path.join(logDir, `${level.toLowerCase()}-${new Date().toISOString().split("T")[0]}.log`);
  fs.appendFileSync(
    logFile,
    JSON.stringify(logObject) + "\n"
  );
};

module.exports = {
  info: (msg, data) => log("INFO", msg, data),
  warn: (msg, data) => log("WARN", msg, data),
  error: (msg, data) => log("ERROR", msg, data),
  debug: (msg, data) => log("DEBUG", msg, data),
};
