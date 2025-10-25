import React, { createContext, useState, useContext, useEffect } from 'react';

const FeedContext = createContext();

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
};

export const FeedProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initial posts data with consistent structure
  const initialPosts = [
    {
      id: 1,
      author: {
        name: 'Sarah Johnson',
        role: 'Senior UX Designer at Google',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        isVerified: true
      },
      content: '🚀 Just launched my new design system at Google! It took 6 months of research, testing, and iterations. The key learnings: 1) Always involve developers early 2) Test with real users, not assumptions 3) Documentation is as important as the design itself. What has been your experience building design systems?',
      timestamp: '2 hours ago',
      likes: 127,
      comments: [],
      shares: 8,
      images: [],
      liked: false
    },
    {
      id: 2,
      author: {
        name: 'Alex Chen',
        role: 'Full Stack Developer | React Enthusiast',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        isVerified: false
      },
      content: '💡 Quick tip for React developers: Use React.memo() wisely! It can prevent unnecessary re-renders but don\'t overuse it. Profile your app first to identify actual performance bottlenecks. Remember: premature optimization is the root of all evil. #ReactJS #WebDev #Performance',
      timestamp: '4 hours ago',
      likes: 89,
      comments: [],
      shares: 12,
      images: [],
      liked: false
    },
    {
      id: 3,
      author: {
        name: 'TechCorp Inc.',
        role: 'Leading Technology Solutions',
        avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
        isVerified: true
      },
      content: '🎯 We\'re hiring! Looking for passionate developers to join our team:\n\n• Senior Frontend Developer (React/Vue)\n• Backend Engineer (Node.js/Python)\n• DevOps Engineer (AWS/Docker)\n\nRemote-friendly positions with competitive salary and great benefits. Apply now or share with your network! #Hiring #TechJobs #RemoteWork',
      timestamp: '1 day ago',
      likes: 203,
      comments: [],
      shares: 67,
      images: [],
      liked: false
    }
  ];

  // Load posts from localStorage on initial render
  useEffect(() => {
    const savedPosts = localStorage.getItem('socialFeedPosts');
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        // Ensure all posts have the required structure
        const validatedPosts = parsedPosts.map(post => ({
          id: post.id || Date.now(),
          author: post.author || {
            name: 'Unknown User',
            role: 'User',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            isVerified: false
          },
          content: post.content || '',
          timestamp: post.timestamp || 'Just now',
          likes: post.likes || 0,
          comments: post.comments || [],
          shares: post.shares || 0,
          images: post.images || [],
          liked: post.liked || false
        }));
        setPosts(validatedPosts);
      } catch (error) {
        console.error('Error parsing saved posts:', error);
        setPosts(initialPosts);
      }
    } else {
      // If no saved posts, use initial posts
      setPosts(initialPosts);
      localStorage.setItem('socialFeedPosts', JSON.stringify(initialPosts));
    }
  }, []);

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('socialFeedPosts', JSON.stringify(posts));
    }
  }, [posts]);

  const addPost = (newPost) => {
    const postWithId = {
      ...newPost,
      id: Date.now(),
      timestamp: 'Just now',
      likes: 0,
      comments: [],
      shares: 0,
      liked: false
    };
    setPosts(prevPosts => [postWithId, ...prevPosts]);
  };

  const likePost = (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: post.liked ? post.likes - 1 : post.likes + 1,
              liked: !post.liked
            }
          : post
      )
    );
  };

  const addComment = (postId, commentText, user) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, {
                id: Date.now(),
                author: { 
                  name: user?.name || 'User', 
                  avatar: user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
                  role: user?.userType === 'student' ? 'Student' : 'Recruiter'
                },
                text: commentText,
                timestamp: 'Just now'
              }]
            }
          : post
      )
    );
  };

  const sharePost = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, shares: post.shares + 1 }
          : post
      )
    );
  };

  const value = {
    posts,
    addPost,
    likePost,
    addComment,
    sharePost,
    loading
  };

  return (
    <FeedContext.Provider value={value}>
      {children}
    </FeedContext.Provider>
  );
};