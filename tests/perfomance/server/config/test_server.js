module.exports = {
    frontPort: process.env.FRONT_PORT || process.env.PORT,
    dbConnectionUrl: process.env.MONGOLAB_URI,
    stripeKey: ""
};
