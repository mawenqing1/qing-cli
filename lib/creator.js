const { fetchRepoList, fetchTagList } = require("./request");
const Inquirer = require("inquirer");
const { wrapLoading } = require("./util");
const util = require('util');
const path = require('path');
const downloadGitRepo = require('download-git-repo'); 

class Creator {
    constructor(projectName, targetDir) {
        this.name = projectName;
        this.target = targetDir;
        this.downloadGitRepo = util.promisify(downloadGitRepo);
    }

    async fetchRepo() {
        let repos = await wrapLoading(fetchRepoList, "waiting fetch template");
        let templates = [];
        repos.forEach((el) => {
            if (el.name.includes("template")) templates.push(el.name);
        });
        // console.log("repos", repos);
        if (templates.length === 0) return;
        let { repo } = await Inquirer.prompt({
            name: "repo",
            type: "list",
            choices: templates,
            message: "please choose a template to create project",
        });
        return repo;
    }

    async fetchTag(repo) {
        let tags = await wrapLoading(fetchTagList, "waiting fetch tag", repo);
        if (!tags) return;
        tags = tags.map((el) => el.name);
        let { tag } = await Inquirer.prompt({
            name: "tag",
            type: "list",
            choices: tags,
            message: "please choose a tag to create project",
        });
        return repo;
    }

    async download(repo, tag) {
        let requestUrl = `github:mawenqing1/${repo}`;
        await wrapLoading(this.downloadGitRepo, "waiting fetch file", requestUrl, path.resolve(process.cwd(), `${repo}`));
        // await this.downloadGitRepo(requestUrl, path.resolve(process.cwd(), `${repo}@${tag}`))
        return this.target
    }

    async create() {
        let repo = await this.fetchRepo();

        let tag = await this.fetchTag(repo);

        await this.download(repo, tag);
    }
}

module.exports = Creator;
