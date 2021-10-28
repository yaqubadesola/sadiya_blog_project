module.exports = (req, res, next) => {
    if (req.session !== undefined) {
        const { loggedin, username } = req.session
        if (loggedin) {
            res.locals.loggedin = req.session.loggedin
            res.locals.username = req.session.username
        }
    }

    next()
}