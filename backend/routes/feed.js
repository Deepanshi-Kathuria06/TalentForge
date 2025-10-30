// backend/routes/feed.js
import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';

const router = express.Router();

// Helper function to get user display info
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
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=004030&color=fff`
  };
};

// ✅ TEST ENDPOINTS
router.get('/test', (req, res) => {
  console.log('✅ Feed test endpoint hit');
  res.json({ 
    message: 'Feed API is working!',
    timestamp: new Date().toISOString()
  });
});

// ✅ GET /api/feed/posts - Get all posts with pagination
router.get('/posts', async (req, res) => {
  try {
    console.log('📨 GET /api/feed/posts called');
    
    const posts = await Post.find()
      .populate('author')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${posts.length} posts in database`);

    // Transform posts to include user display info
    const transformedPosts = posts.map(post => ({
      ...post._doc,
      author: getUserDisplayInfo(post.author)
    }));

    res.json(transformedPosts);
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// ✅ POST /api/feed/posts - Create new post (No auth required)
router.post('/posts', async (req, res) => {
  console.log('📨 POST /api/feed/posts called');
  console.log('Request body:', req.body);

  try {
    const { content, images, authorId } = req.body;
    
    if (!authorId) {
      return res.status(400).json({ error: 'authorId is required' });
    }

    console.log('Creating new post with:', { content, images, authorId });

    // Verify the author exists
    const author = await User.findById(authorId);
    if (!author) {
      return res.status(404).json({ error: 'User not found' });
    }

    const post = new Post({
      content,
      images: images || [],
      author: authorId,
      likes: [],
      shares: 0,
      comments: []
    });

    console.log('Post object before save:', post);
    
    await post.save();
    console.log('✅ Post saved to MongoDB with ID:', post._id);
    
    await post.populate('author');
    const transformedPost = {
      ...post._doc,
      author: getUserDisplayInfo(post.author)
    };

    console.log('Sending response:', transformedPost);
    
    res.status(201).json(transformedPost);
  } catch (error) {
    console.error('❌ Error in POST /api/feed/posts:', error);
    res.status(400).json({ error: 'Failed to create post: ' + error.message });
  }
});

// ✅ PATCH /api/feed/posts/:id/like - Like/unlike post (No auth)
router.patch('/posts/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id).populate('author');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const likeIndex = post.likes.indexOf(userId);
    
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    
    const transformedPost = {
      ...post._doc,
      author: getUserDisplayInfo(post.author)
    };
    
    res.json(transformedPost);
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(400).json({ error: 'Failed to like post' });
  }
});

// ✅ POST /api/feed/posts/:id/comments - Add comment to post (No auth)
router.post('/posts/:id/comments', async (req, res) => {
  try {
    const { text, authorId } = req.body;
    const post = await Post.findById(req.params.id).populate('author');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!authorId) {
      return res.status(400).json({ error: 'authorId is required' });
    }

    // Verify comment author exists
    const commentAuthor = await User.findById(authorId);
    if (!commentAuthor) {
      return res.status(404).json({ error: 'Comment author not found' });
    }
    
    post.comments.push({
      text,
      author: authorId,
      createdAt: new Date()
    });

    await post.save();
    
    // Populate comments authors
    await post.populate('comments.author');
    
    const transformedPost = {
      ...post._doc,
      author: getUserDisplayInfo(post.author),
      comments: post.comments.map(comment => ({
        ...comment._doc,
        author: getUserDisplayInfo(comment.author)
      }))
    };
    
    res.json(transformedPost);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(400).json({ error: 'Failed to add comment' });
  }
});

// ✅ PATCH /api/feed/posts/:id/share - Share post (No auth)
router.patch('/posts/:id/share', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.shares += 1;
    await post.save();
    
    const transformedPost = {
      ...post._doc,
      author: getUserDisplayInfo(post.author)
    };
    
    res.json(transformedPost);
  } catch (error) {
    console.error('Error sharing post:', error);
    res.status(400).json({ error: 'Failed to share post' });
  }
});

export default router;