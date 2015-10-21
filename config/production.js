module.exports = {
    githubAppId: process.env.GITHUB_ID,
    githubAppSecret: process.env.GITHUB_SECRET,
    githubAppCallback: process.env.GITHUB_CALLBACK,
    frontPort: process.env.FRONT_PORT || process.env.PORT,
    dbConnectionUrl: process.env.MONGOLAB_URI,
    stripeKey: process.env.STRIPE_KEY
};
