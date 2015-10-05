module.exports = {
    githubAppId: process.env.GITHUB_ID,
    githubAppSecret: process.env.GITHUB_SECRET,
    githubAppCallback: process.env.GITHUB_CALLBACK,
    frontPort: process.env.FRONT_PORT,
    socketPort: process.env.SOCKET_PORT,
    dbConnectionUrl: process.env.MONGOLAB_URI
};
