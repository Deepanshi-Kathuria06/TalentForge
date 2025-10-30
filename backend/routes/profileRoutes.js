// routes/profileRoutes.js
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET /api/profile/me/:id - Get current user's profile
router.get('/me/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/profile/:id - Get any user's profile (for viewing others)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/profile/update/:id - Update user profile
router.put('/update/:id', async (req, res) => {
  try {
    console.log('📝 Updating profile for:', req.params.id);
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('✅ Profile updated successfully');
    res.json(updatedUser);
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;