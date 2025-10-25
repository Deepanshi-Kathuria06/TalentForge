// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // ✅ Import User model

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token, authorization denied' 
      });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // ✅ Get full user data from database
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'User not found' 
        });
      }
      
      req.user = user; // ✅ Store full user object, not just decoded token
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ 
        success: false,
        message: 'Token is not valid' 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error in authentication' 
    });
  }
};

export default authMiddleware; // ✅ ES module export is correct