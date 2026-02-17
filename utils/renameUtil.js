const path = require("path");

async function generateNewNames(files, pattern, startNumber) {
	let newFileNames = [];

	const highest = startNumber + files.length - 1;

	for (const file of files) {
		const pathExt = path.extname(file);
		let numStr = startNumber.toString();
		const startNumberPad = numStr.padStart(String(highest).length, "0");

		let newName = `${pattern}${startNumberPad}${pathExt}`;

		startNumber++;
		let fileNameObj = { oldName: file, newName };
		newFileNames.push(fileNameObj);
	}

	return newFileNames;
}

module.exports = {
	generateNewNames,
};
