const adminAuth = (req, res, next) => {
    // req.headers['authorization'] = "Bearer abc123xyz"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Splits "Bearer <token>"
    console.log("Extracted Token:", token);

    //if token is not passed in the authentication headers
    if(!token || token !== 'adminBearerToken') return res.status(401).send("Unauthorized: Missing or invalid token format");
    //... code to check whether the token is invalid or expired
    // using jwt library checker return the response accordingly

    next();

}

const userAuth = (req, res, next) => {
    // req.headers['authorization'] = "Bearer abc123xyz"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Splits "Bearer <token>"
    console.log("Extracted Token:", token);

    //if token is not passed in the authentication headers
    if(!token || token !== 'userBearerToken') return res.status(401).send("Unauthorized: Missing or invalid token format");
    //... code to check whether the token is invalid or expired
    // using jwt library checker return the response accordingly

    next();

}

module.exports = {adminAuth, userAuth}