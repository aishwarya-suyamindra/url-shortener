import authenticateToken from "../middleware/auth.js";
import validateLimit from "../middleware/rateLimiter.js";
import validateURL from "../middleware/urlValidator.js";

function AppRoutes(app, userService, urlService) {
    app.get("/", (req, res) => {
        res.send("Im listening")
    })

    app.post("/token", (req, res) => {
        const data = req.body
        userService.signUp(data.email).then(token => {
            res.status(200).send(token);
        }).catch(error => {
            res.status(500).send(error.message)
        })
    })

    app.get('/history', authenticateToken, validateLimit, (req, res) => {
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

    app.post('/shortenURL', authenticateToken, validateLimit, validateURL, (req, res) => {
        urlService.shortenURL(req.user.id, req.body.url).then((shortUrl) => {
            res.status(200).send(shortUrl)
        }).catch(error => {
            res.status(500).send(error.message)
        })
    })
}

export default AppRoutes;