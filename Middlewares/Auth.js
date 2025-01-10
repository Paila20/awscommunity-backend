
// const jwt = require('jsonwebtoken');
// const ensureAuthenticated = (req, res, next) => {
//     const auth = req.headers['authorization'];
//     if (!auth || !auth.startsWith('Bearer ')) {
//         return res.status(403)
//             .json({ message: 'Unauthorized, JWT token is require' });
//     }
//     try {
//         const decoded = jwt.verify(auth, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         return res.status(403)
//             .json({ message: 'Unauthorized, JWT token wrong or expired' });
//     }
// }
// const isAdmin = (req, res, next) => {
//     console.log(req.user.role)
//     if (req.user.role !== 'Admin') {
//         return res.status(403).json({ message: 'Access denied, Admins only' });
//     }
//     next();
// };
// const isEditor = (req, res, next) => {
//     if (req.user.role !== 'Editor') {
//         return res.status(403).json({ message: 'Access denied. Only editors can perform this action.' });
//     }
//     next();
// };

// module.exports ={ensureAuthenticated,isAdmin,isEditor} ;



const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];

    // Check if the Authorization header is present and starts with 'Bearer '
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is required' });
    }

    // Extract the token from the Authorization header
    const token = auth.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded token to the request
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Unauthorized, JWT token wrong or expired' });
    }
};

const isAdmin = (req, res, next) => {
    console.log(req.user.role);
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied, Admins only' });
    }
    next();
};

const isEditor = (req, res, next) => {
    if (req.user.role !== 'Editor') {
        return res.status(403).json({ message: 'Access denied. Only editors can perform this action.' });
    }
    next();
};

module.exports = { ensureAuthenticated, isAdmin, isEditor };
