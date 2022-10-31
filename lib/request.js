const axios = require('axios');

axios.interceptors.response.use(res => {
    return res.data;
})

async function fetchRepoList() {
    return axios.get('https://api.github.com/users/mawenqing1/repos'); //repo address
}

async function fetchTagList(repo) {
    return axios.get(`https://api.github.com/repos/mawenqing1/${repo}/tags`)
}

module.exports = {
    fetchRepoList,
    fetchTagList 
}