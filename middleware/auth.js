// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 

//
    const protect = async (request, res, next) =>{
        try {
            const token = request.cookies?.accessToken;
    
            if(!token){
                return res.status(401).json({ message: 'No autorizado, no hay token' });
            }

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.id);
            request.user = user;
            
        } catch (error) {
            
           return res.status(403).json({ message: 'No autorizado, error al verificar' });

    
        }    
        next();
    };

// Middleware for verifying if the user is an admin
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); 
  } else {
   return res.status(403).json({ message: 'No autorizado, no eres administrador' });
  }
};

module.exports = { protect, authorizeAdmin };