// backend/routes/search.js
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET /api/search/users - Search users
router.get('/users', async (req, res) => {
  try {
    const { q } = req.query;
    
    console.log('🔍 Search request:', { q });

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
      .limit(10);

    console.log(`✅ Found ${users.length} users for: "${q}"`);

    const results = users.map(user => ({
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
    }));

    res.json(results);
  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({ error: 'Search failed: ' + error.message });
  }
});

export default router;