'use strict'
const tslint = require("tslint");
const fs = require("fs");
const path = require('path');
const chalk = require('chalk');

const {Configuration, Linter} = tslint;

export default (directory, files, { config, onWriteFile } = {}) => {
  let hashError = false;

  const options = {
      fix: false,
      formatter: "json",
      rulesDirectory: "customRules/",
      formattersDirectory: "customFormatters/"
  };

  for (const relative of files) {
    const file = path.join(directory, relative);
    console.log('ffff', file);
    
    const fileName = relative;
    const configurationFilename = "tslint.json";
    const configuration = Configuration.findConfiguration(configurationFilename, fileName).results;
    const fileContents = fs.readFileSync(file, "utf8");

    const linter = new Linter(options);
    linter.lint(fileName, fileContents, configuration);
    const result = linter.getResult();
    if (result && result.errorCount > 0) {
      hashError = true;
      for (let failure of result.failures) {
        console.log(`ERROR: ${file}[${failure.startPosition.lineAndCharacter.line} ${failure.startPosition.position}]: ${failure.failure}`);
      }
    }
  }
  if (hashError) {
    process.exit(2);
  }
};
