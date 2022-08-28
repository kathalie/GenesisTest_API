import fs from "fs";

function addToFile(textToAppend, fileName) {
    fs.appendFile(textToAppend, fileName, err => {
        if (err) throw err;
    });
}

function getFileContent(fileName) {
    let fileContent = fs.readFileSync(fileName, 'utf-8').split('\n');
    if (fileContent[fileContent.length - 1].replace(" ", "") === '')
        fileContent.pop();
    return fileContent;
}

export {addToFile, getFileContent}