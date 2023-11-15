import jwt from "jsonwebtoken";

const createToken = (id, secret) => {
    return jwt.sign(
        { id },
        secret,
        { expiresIn: "10m" }
    )
}

export default createToken;