#!/usr/bin/env node
const path = require("path");
const fs = require("fs");

// Get path to package.json (assumed to be in same directory as this script)
const packagePath = path.join(__dirname, "package.json");

try {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
  console.log(`SimpliPlay Desktop installer version: ${packageJson.version}`);
} catch (error) {
  console.error("Error reading package.json:", error.message);
  process.exit(1);
}
