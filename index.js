#!/usr/bin/env node
const { Command } = require("commander");
const { prepareRename, executeRename } = require("./services/fileService");
const { default: chalk } = require("chalk");
const readlineSync = require("readline-sync");
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

const folder = options.folder;
const extension = options.ext ?? null;
const pattern = options.pattern;
const startNumber = Number(options.start) ?? 1;

function displayPreview(renameMap) {
	if (renameMap.length === 0) {
		console.log(chalk.yellow("No files to rename."));
		return false;
	}
	console.log(chalk.gray(`Folder: ${folder}`));
	console.log(chalk.gray(`Total files: ${renameMap.length}\n`));

	console.log(chalk.grey(chalk.bold(`Preview:`)));

	console.log("-".repeat(40));
	renameMap.forEach(({ oldName, newName }) => {
		console.log(chalk.bgYellow(oldName) + " → " + chalk.bgGreen(newName));
	});
	console.log("-".repeat(40));
	return true;
}
async function main() {
	try {
		const renameMap = await prepareRename(
			folder,
			pattern,
			startNumber,
			extension,
		);

		const hasDisplayed = displayPreview(renameMap);

		if (!hasDisplayed) {
			return;
		}

		let userInput = readlineSync.question(
			"Would you like to proceed (y/n): ",
		);

		if (userInput.toLowerCase() !== "y") {
			return;
		}

		const hasRenamed = await executeRename(folder, renameMap);

		if (!hasRenamed) {
			console.log(chalk.redBright("File has not been renamed"));
			return;
		}

		console.log(chalk.greenBright("Files have been renamed successfully"));
	} catch (error) {
		console.log(chalk.redBright(error.message));
		process.exit(1);
	}
}

main();
