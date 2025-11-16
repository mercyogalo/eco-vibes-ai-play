const axios = require("axios");
const pdf = require("pdf-parse");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

module.exports = async function readFile(url) {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(res.data);

  if (url.endsWith(".pdf")) {
    const data = await pdf(buffer);
    return data.text || "";
  }

  const tempPath = path.join(__dirname, "temp.docx");
  fs.writeFileSync(tempPath, buffer);

  try {
    const output = execSync(`docx2txt < "${tempPath}" -`).toString();
    fs.unlinkSync(tempPath);
    return output;
  } catch {
    fs.unlinkSync(tempPath);
    return "";
  }
};
