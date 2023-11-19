function AppRoutes(app, userService, urlService, middleware) {
    app.get("/", (req, res) => {
        res.send("Im listening")
    })

    app.post("/token", middleware.validateEmail ,(req, res) => {
        const data = req.body
        userService.signUp(data.email).then(token => {
            res.status(200).send(token);
        }).catch(error => {
            res.status(500).send(error.message)
        })
    })

    app.get('/history', middleware.authenticateToken, middleware.validateLimit, (req, res) => {
        urlService.getHistory(req.user.id).then((urls) => {
            res.status(200).send(urls)
        }).catch(error => {
            res.status(500).send(error.message)
        })
    })

    app.get("/:code", (req, res) => {
        const code = req.params.code
        urlService.redirect(code).then(originalUrl => {
            res.redirect(originalUrl)
        }).catch(error => {
            res.status(500).send(error.message)
        })
    })

    app.post('/shortenURL', middleware.authenticateToken, middleware.validateLimit, middleware.validateURL, (req, res) => {
        urlService.shortenURL(req.user.id, req.body.url).then((shortUrl) => {
            res.status(200).send(shortUrl)
        }).catch(error => {
            res.status(500).send(error.message)
        })
    })
}

export default AppRoutes;