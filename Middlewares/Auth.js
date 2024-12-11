
const jwt = require('jsonwebtoken');
const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.status(403)
            .json({ message: 'Unauthorized, JWT token is require' });
    }
    try {
        const decoded = jwt.verify(auth, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403)
            .json({ message: 'Unauthorized, JWT token wrong or expired' });
    }
}

module.exports = ensureAuthenticated;

// const jwt = require('jsonwebtoken');

// const ensureAuthenticated = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     console.log('Authorization Header:', authHeader);
//     if (!authHeader) {
//         return res.status(403).json({ message: 'Unauthorized, JWT token is required' });
//     }

//     // Extract the token by removing "Bearer " from the Authorization header
//     const token = authHeader.split(' ')[1];

//     if (!token) {
//         return res.status(403).json({ message: 'Unauthorized, JWT token is required' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Ensure the JWT_SECRET matches your signing key
//         req.user = decoded;  // Store the decoded token in the request object
//         next();  // Pass control to the next middleware or route handler
//     } catch (err) {
//         return res.status(403).json({ message: 'Unauthorized, JWT token is wrong or expired' });
//     }
// };

// module.exports = ensureAuthenticated;
