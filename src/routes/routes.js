import userService from "../services/userService.js";
import authenticateToken from "../middleware/auth.js";
import validateLimit from "../middleware/rateLimiter.js";
import * as repository from "../services/databaseService.js";

function AppRoutes(app) {
    app.get("/", (req, res) => {
        res.send("Im listening")
    })
    
    app.post("/token", (req, res) => {
        const data = req.body
        userService(repository).signUp(data.email).then(token => {
            res.status(200).send(token);
        }).catch(error => {
            res.status(500).send(error.message)
        })
    })
    
    app.post('/shortenURL', authenticateToken, validateLimit, (req, res) => {
        // TODO.
      })
    
    app.get('/history', authenticateToken, validateLimit, (req, res) => {
        // TODO.
        res.status(200).send("History!!!")
    })
}

export default AppRoutes;