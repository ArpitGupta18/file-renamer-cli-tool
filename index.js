#!/usr/bin/env node
const { Command } = require("commander");
const program = new Command();

program
	.option("--folder <path>", "Folder path")
	.option("--pattern <pattern>", "Rename pattern")
	.option("--start <number>", "Starting number", 1)
	.option("--ext <extension>", "File extension filter");

program.parse(process.argv);

const options = program.opts();

if (!options.folder || !options.pattern) {
	console.log("Folder and pattern are required");
	process.exit(1);
}

console.log(options);

console.log(process.argv);
