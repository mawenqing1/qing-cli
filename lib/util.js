const ora = require('ora');

async function sleep(n) {
    return new Promise((resolve, reject) => setTimeout(resolve, n))
}

async function wrapLoading(fn, message, ...args) {
    const spinner = ora(message);
    spinner.start();
    try {
        let repo = await fn(...args);
        spinner.succeed();
        return repo
    } catch(err) {
        spinner.fail('request  failed, refetch...');
        await sleep(1000);
        return wrapLoading(fn, message, ...args)
    }
}

module.exports = {
    wrapLoading
}