const {jwtDecode} = require('jwt-decode');
const verifyToken = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if(!token){
        return res.status(401).json({ message: "Access Token is missing" })
    } else {
        const decode = jwtDecode(token);
        if(!decode){
            return res.status(401).json({ message: "Invalid Token" })
        }
        req.user = decode;
        next()
    }
}
const verifyTokenAdmin = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    if(!token){
        return res.status(401).json({ message: "Access Token is missing" })
    } else {
        const decode = jwtDecode(token);
        if(!decode){
            return res.status(401).json({ message: "Invalid Token" })
        }
        if(decode.role !== 1){
            return res.status(403).json({ message: "You are not an admin" })
        } else {
            req.user = decode;
            next()
        }
    }
}

module.exports = {verifyToken, verifyTokenAdmin}