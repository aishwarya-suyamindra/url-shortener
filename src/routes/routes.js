/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       name: Authorization
 *       scheme: bearer
 *       bearerFormat: JWT
 */

function AppRoutes(app, userService, urlService, middleware) {
    app.get("/", (req, res) => {
        res.send("Up and listening!")
    })

    /**
    * @swagger
    * /token:
    *   post:
    *     summary: Generate a new JWT token for the user
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *               properties:
    *                    email:
    *                        type: string
    *                        example: "test@gmail.com" 
    *           
    *     responses:
    *       200:
    *         description: The generated token.
    *         content:
    *           application/json:
    *             schema:
    *               properties:
    *                    token:
    *                        type: string
    *       500:
    *         description: Server error
    *
    */
    app.post("/token", middleware.validateEmail, (req, res) => {
        const data = req.body
        userService.signUp(data.email).then(token => {
            res.status(200).send({"token": token});
        }).catch(error => {
            res.status(500).send(error)
        })
    })

     /**
    * @swagger
    * /history:
    *   get:
    *     summary: Get the url shortener history for the user
    *     security: [
    *       bearerAuth: []
    *     ]
    *     responses:
    *       200:
    *         description: The original urls shortened by the user.
    *         content:
    *           application/json:
    *            schema:
    *               type: array
    *               items:
    *                   type: String
    *                   example: "www.google.com" 
    *       403:
    *         description: Forbidden
    *         content:
    *           application/json:
    *            schema:
    *               type: String
    *               example: Please register first!
    *       429:
    *         description: Too many requests from the user
    *         content:
    *           application/json:
    *            schema:
    *               type: String
    *               example: Too many requests. Please try again in some time or upgrade your tier.
    *       
    *
    */
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

     /**
    * @swagger
    * /shortenURL:
    *   post:
    *     summary: Shortern a given url.
    *     security: [
    *       bearerAuth: []
    *     ]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *               properties:
    *                    url:
    *                        type: string
    *                        example: "https://www.google.com/maps" 
    *     responses:
    *       200:
    *         description: The shortened url. Navigating to the shortened url redirects to the original url.
    *         content:
    *           application/json:
    *            schema:
    *               type: string
    *               example: "http://localhost.." 
    *       403:
    *         description: Forbidden
    *         content:
    *           application/json:
    *            schema:
    *               type: String
    *               example: Please register first!
    *       429:
    *         description: Too many requests from the user
    *         content:
    *           application/json:
    *            schema:
    *               type: String
    *               example: Too many requests. Please try again in some time or upgrade your tier.
    *       
    *
    */
    app.post('/shortenURL', middleware.authenticateToken, middleware.validateLimit, middleware.validateURL, (req, res) => {
        urlService.shortenURL(req.user.id, req.body.url).then((shortUrl) => {
            res.status(200).send(shortUrl)
        }).catch(error => {
            res.status(500).send(error.message)
        })
    })
}

export default AppRoutes;