const path = require("path");

const fs = require("fs").promises;

async function checkDirectoryExist(directory) {
	try {
		const stats = await fs.stat(directory);

		if (!stats.isDirectory()) throw new Error();
		return stats.isDirectory();
	} catch (error) {
		return false;
	}
}

async function getDirectoryFileNames(directory) {
	const items = await fs.readdir(directory, { withFileTypes: true });

	return items.filter((item) => item.isFile()).map((file) => file.name);
}

async function getFilesWithSpecificExtension(files, extension) {
	return files
		.filter(
			(file) =>
				path.extname(file).split(".")[1].toLowerCase() ===
				extension.toLowerCase(),
		)
		.sort();
}

module.exports = {
	checkDirectoryExist,
	getDirectoryFileNames,
	getFilesWithSpecificExtension,
};
