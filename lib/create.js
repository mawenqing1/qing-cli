const path = require('path');
const fs = require('fs-extra;')

module.exports = async function (projectName, options) {
    console.log('create', projectName, options);
    const cwd = process.cwd(); //get current working directory
    const targetDir = path.join(cwd, projectName);

    if(fs.existsSync(targetDir)) {
        if(options.force) {
            await fs.remove(targetDir)
        }
    }
}