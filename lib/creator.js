class Creator {
    constructor(projectName, targetDir) {
        this.name = projectName;
        this.target = targetDir;
    }

    async fetchRepo () {

    }

    async fetchTag() {

    }

    async download() {
        
    }

    async create() {

        let repo = await this.fetchRepo();
        
        let tag = await this.fetchTag(repo);

        let downloadUrl = await this.download(repo, tag);
    }
}

module.exports = Creator