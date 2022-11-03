const { fetchRepoList, fetchTagList } = require("./request");
const Inquirer = require("inquirer");
const { wrapLoading } = require("./util");
const util = require("util");
const path = require("path");
const fs = require("fs-extra");
const downloadGitRepo = require("download-git-repo");
const handlebars = require("handlebars");
const chalk = require("chalk");

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
        return tag;
    }

    async getDescription() {
        let { description } = await Inquirer.prompt({
            name: "description",
            type: "input",
            default: "",
            message: "please enter the project description",
        });
        return description;
    }

    async getAuthor() {
        let { author } = await Inquirer.prompt({
            name: "author",
            type: "input",
            default: "",
            message: "please enter the project author",
        });
        return author;
    }

    async download(repo, tag) {
        let requestUrl = `github:mawenqing1/${repo}${tag ? "#" + tag : ""}`;
        await wrapLoading(
            this.downloadGitRepo,
            "waiting fetch file",
            requestUrl,
            path.resolve(process.cwd(), `${this.name}`)
        );
        // await this.downloadGitRepo(requestUrl, path.resolve(process.cwd(), `${this.name}`))
        return this.target;
    }

    async create() {
        let author = await this.getAuthor();
        let description = await this.getDescription();
        let repo = await this.fetchRepo();
        let tag = await this.fetchTag(repo);
        await this.download(repo, tag);
        const packageName = `${this.name}/package.json`;
        const name = this.name;
        const packageContext = fs.readFileSync(packageName, "utf8");
        let packageResult = handlebars.compile(packageContext)({
            name,
            description,
            author,
        });
        fs.writeFileSync(packageName, packageResult);
        console.log(
            `\r\nSuccessfully created project ${chalk.cyan(name)}`
        );
        console.log(`\r\n  cd ${chalk.cyan(name)}`);
        console.log(`\r\n  npm install`);
        console.log("\r\n  npm run dev\r\n");
    }
}

module.exports = Creator;
