const { join } = require("path");
const execa = require("execa");
const download = require("download");
const fetch = require("node-fetch");

const API =
  "https://api.github.com/repos/contentz-tech/template/releases/latest";

async function main(name = null) {
  const cwd = name ? join(process.cwd(), name) : process.cwd();

  console.log("Fetching latest release of the template...");
  const response = await fetch(API);
  const { tarball_url: tarbalURL } = await response.json();

  console.log("Downloading template project...");
  await download(tarbalURL, cwd, {
    extract: true,
    strip: 1,
    filter(file) {
      return (
        !file.path.includes(".gitkeep") || !file.path.includes("renovate.json")
      );
    }
  });

  console.log("Installing dependencies...");
  await execa.shell(`cd ${cwd} && yarn install ; cd -`);

  console.log("Your project on %s has been successfully initialized.", cwd);
  if (process.cwd() !== cwd) console.log("Move with `cd %s`", name);
  console.log("Write your first article using then `yarn write` command.");
  console.log("And start working in your machine with the `yarn dev` command");
}

module.exports = main;
