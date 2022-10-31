const { fetchRepoList, fetchTagList } = require("./request");
const Inquirer = require("inquirer");
const {wrapLoading} = require('./util');


class Creator {
    constructor(projectName, targetDir) {
        this.name = projectName;
        this.target = targetDir;
    }

    async fetchRepo() {
        let repos = await wrapLoading(fetchRepoList, 'waiting fetch template');
        let templates = [];
        repos.forEach((el) => {
            if (el.name.includes("template")) templates.push(el.name);
        });
        // console.log("repos", repos);
        if (templates.length === 0) return;
        let { repo } = await Inquirer.prompt({
            name: 'repo',
            type: 'list',
            choices: templates,
            message: 'please choose a template to create project'
        });
        return repo
    }

    async fetchTag(repo) {
        let tags = await wrapLoading(fetchTagList, 'waiting fetch tag', repo);
        if(!tags) return;
        tags = tags.map(el => el.name);
        let { tag } = await Inquirer.prompt({
            name: 'tag',
            type: 'list',
            choices: tags, 
            message: 'please choose a tag to create project'
        });
        return repo
    }

    async download() {}

    async create() {
        let repo = await this.fetchRepo(); 

        let tag = await this.fetchTag(repo);

        let downloadUrl = await this.download(repo, tag);
    }
}

module.exports = Creator;
