import database from "../services/databaseService.js"

/**
 * Middleware to check if the tier specified is a valid tier.
 */

const validateTier = async (req, res, next) => {
    const validTiers = await database.getAllTiers()
    const tier = req.body.tier
    const upgradeToTier = await database.getTier({ name: tier })
    if (!upgradeToTier) {
        res.status(400).send("Invalid tier. Please specify one of - " + validTiers.map((x) => x._doc.name).join(", "))
    }
    next();
}

export default validateTier