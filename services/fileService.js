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

module.exports = {
	checkDirectoryExist,
	getDirectoryFileNames,
};
