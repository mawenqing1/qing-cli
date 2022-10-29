const path = require('path');

module.exports = async function (projectName, options) {
    console.log('create', projectName, options);
    const cwd = process.cwd(); //get current working directory
    const targetDir = path.join(cwd, projectName);
}