const fs = require("fs");

const envFilePath = ".env";
const envContent = fs.readFileSync(envFilePath, "utf8");

const envLines = envContent.split("\n");
let newEnvContent = "";

envLines.forEach((line) => {
  if (line.startsWith("APP_VERSION=")) {
    const value = parseFloat(line.split("=")[1]) || 0;
    const newValue = (value + 0.1).toFixed(1);
    newEnvContent += `APP_VERSION=${newValue}\n`;
  } else {
    newEnvContent += line + "\n";
  }
});

fs.writeFileSync(envFilePath, newEnvContent.trim());
