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

async function main() {
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

	const folderExists = await checkDirectoryExist(folder);

	if (!folderExists) {
		console.log(chalk.redBright("Directory doesn't exist"));
		return;
	}

	const files = await getDirectoryFileNames(folder);
	// console.log(files);

	const extension = options.ext ?? null;

	const filesWithSpecificExtension = !!extension
		? await getFilesWithSpecificExtension(files, extension)
		: files;

	const pattern = options.pattern;
	const startNumber = options.start ?? 1;

	const generatedFileNames = await prepareRename(
		filesWithSpecificExtension,
		pattern,
		startNumber,
	);

	console.log(generatedFileNames);
}

main();
