#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");
const { exec } = require("child_process");

const args = process.argv.slice(2);

if (args[0] === 'version' || args[0] === 'ver') {
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log("SimpliPlay Desktop installer version: " + packageJson.version);
  process.exit(0);
}

const installers = {
  win32: {
    x64: "https://github.com/A-Star100/simpliplay-desktop/releases/latest/download/SimpliPlay-x64-win-setup.exe",
    arm64: "https://github.com/A-Star100/simpliplay-desktop/releases/latest/download/SimpliPlay-arm64-win-setup.exe",
  },
  darwin: {
    x64: "https://github.com/A-Star100/simpliplay-desktop/releases/latest/download/SimpliPlay-x64-darwin.dmg",
    arm64: "https://github.com/A-Star100/simpliplay-desktop/releases/latest/download/SimpliPlay-arm64-darwin.dmg",
  },
  linux: {
    x64: "https://github.com/A-Star100/simpliplay-desktop/releases/latest/download/SimpliPlay-x64-linux.AppImage",
    arm64: "https://github.com/A-Star100/simpliplay-desktop/releases/latest/download/SimpliPlay-arm64-linux.AppImage",
  },
};

const platform = os.platform();
const arch = os.arch();

if (!installers[platform] || !installers[platform][arch]) {
  console.error(`Unsupported platform/architecture combo: ${platform} ${arch}`);
  process.exit(1);
}

const installerUrl = installers[platform][arch];
const fileName = path.basename(installerUrl);
const filePath = path.join(__dirname, fileName);

function askOverwrite(callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(`Installer already exists at ${filePath}. Overwrite? (y/N): `, (answer) => {
    rl.close();
    callback(/^y(es)?$/i.test(answer.trim()));
  });
}

function openUrl(url) {
  switch (platform) {
    case 'win32':
      exec(`start "" "${url}"`);
      break;
    case 'darwin':
      exec(`open "${url}"`);
      break;
    case 'linux':
      exec(`xdg-open "${url}"`);
      break;
    default:
      console.error('Cannot open URL automatically on this platform.');
  }
}

// === Main Logic ===
if (fs.existsSync(filePath)) {
  askOverwrite((shouldOverwrite) => {
    if (shouldOverwrite) {
      openUrl(installerUrl)
    } else {
      console.log("Aborted. Installer not overwritten.");
    }
  });
} else {
  openUrl(installerUrl);
}
