module.exports = {
    githubAppId: process.env.GITHUB_ID,
    githubAppSecret: process.env.GITHUB_SECRET,
    githubAppCallback: process.env.GITHUB_CALLBACK,
    port: process.env.PORT,
    redirectUrl: process.env.FRONT_REDIRECT,
    dbConnectionUrl: process.env.MONGOLAB_URI
};
