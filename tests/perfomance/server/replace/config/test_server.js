module.exports = {
    frontPort: process.env.FRONT_PORT || process.env.PORT,
    dbConnectionUrl: process.env.MONGOLAB_URI,
    managerUrl: process.env.MANAGER_URI,
    stripeKey: ""
};
