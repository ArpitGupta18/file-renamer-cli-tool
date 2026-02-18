const path = require("path");
const { generateNewNames } = require("../utils/renameUtil");

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
	return files.filter(
		(file) =>
			path.extname(file).split(".")[1].toLowerCase() ===
			extension.toLowerCase(),
	);
}

async function prepareRename(folder, pattern, startNumber, ext) {
	const folderExists = await checkDirectoryExist(folder);

	if (!folderExists) {
		throw new Error("Directory doesn't exist");
	}

	let files = await getDirectoryFileNames(folder);

	if (ext) {
		files = await getFilesWithSpecificExtension(files, ext);
	}

	files.sort();

	return generateNewNames(files, pattern, startNumber);
}

async function executeRename(folder, renameMap) {
	const tempMap = renameMap.map((item, index) => {
		const ext = path.extname(item.oldName);

		return {
			oldName: item.oldName,
			tempName: `__renamer_tmp${index}${ext}`,
			newName: item.newName,
		};
	});

	try {
		for (const item of tempMap) {
			const oldPath = path.join(folder, item.oldName);
			const tempPath = path.join(folder, item.tempName);
			await fs.rename(oldPath, tempPath);
		}
	} catch {
		return false;
	}

	try {
		for (const item of tempMap) {
			const tempPath = path.join(folder, item.tempName);
			const newPath = path.join(folder, item.newName);
			await fs.rename(tempPath, newPath);
		}
	} catch (error) {
		return false;
	}
	return true;
}

module.exports = {
	prepareRename,
	executeRename,
};
