const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    // Grabbing the token cookie
    const token = req.cookies.jwt

    // Check if json token(web) exist
    // if exist
    if (token) {
        // verify token, match secret signature
        jwt.verify(token, 'secret message', (err, decodedToken) => {
            // if err token is not valid 
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                // Carry on to smoothies view
                console.log(decodedToken);
                next();
            }
        });

    } else {
        res.redirect('/login');
    }
};

// check  current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt

    if (token) {
        jwt.verify(token, 'secret message', async (err, decodedToken) => {
            // if err token is not valid 
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                // Find user by id
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                // access properites like the email and past to header
                // Applies middlewear to ever page
                res.locals.user = user;
                next();
            }
        });
    } else {
        // Doesn't have any user information
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };