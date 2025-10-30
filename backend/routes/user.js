// backend/routes/user.js
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Helper function for user display info
const getUserDisplayInfo = (user) => {
  if (!user) return null;
  
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    userType: user.userType,
    university: user.university,
    major: user.major,
    graduationYear: user.graduationYear,
    company: user.company,
    industry: user.industry,
    companySize: user.companySize,
    website: user.website,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=004030&color=fff`,
    tagline: user.userType === 'student' 
      ? `${user.major || 'Student'} at ${user.university || 'University'}`
      : `Recruiter at ${user.company || 'Company'}`,
    position: user.userType === 'student' ? 'Student' : 'Recruiter'
  };
};

// GET /api/user/search - Search users
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    console.log('🔍 Search query received:', q);

    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const searchQuery = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { university: { $regex: q, $options: 'i' } },
        { major: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { industry: { $regex: q, $options: 'i' } }
      ]
    };

    const users = await User.find(searchQuery)
      .select('name email userType university major graduationYear company industry companySize website')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    console.log(`✅ Found ${users.length} users for query: "${q}"`);

    // Transform users with display info
    const transformedUsers = users.map(user => getUserDisplayInfo(user));

    res.json(transformedUsers);
  } catch (error) {
    console.error('❌ Error searching users:', error);
    res.status(500).json({ error: 'Failed to search users: ' + error.message });
  }
});

// GET /api/user/:id - Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const transformedUser = getUserDisplayInfo(user);

    res.json({ 
      user: transformedUser
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

export default router;