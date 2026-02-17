#!/usr/bin/env node
const { Command } = require("commander");
const program = new Command();
const {
	checkDirectoryExist,
	getDirectoryFileNames,
	getFilesWithSpecificExtension,
	prepareRename,
} = require("./services/fileService");
const { default: chalk } = require("chalk");

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

const folder = options.folder;
const extension = options.ext ?? null;
const pattern = options.pattern;
const startNumber = Number(options.start) ?? 1;

function displayPreview(renameMap) {
	if (renameMap.length === 0) {
		console.log(chalk.yellow("No files to rename."));
		return;
	}

	renameMap.forEach(({ oldName, newName }) => {
		console.log(chalk.bgYellow(oldName) + " → " + chalk.bgGreen(newName));
	});
}
async function main() {
	try {
		const renameMap = await prepareRename(
			folder,
			pattern,
			startNumber,
			extension,
		);

		displayPreview(renameMap);
	} catch (error) {
		console.log(chalk.redBright(error.message));
		process.exit(1);
	}
}

main();
