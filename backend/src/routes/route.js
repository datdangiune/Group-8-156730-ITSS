const auth = require('./auth')
function router(app){
    app.use(`${process.env.DEFAULT_VERSION}/auth`, auth);
}
module.exports = router;