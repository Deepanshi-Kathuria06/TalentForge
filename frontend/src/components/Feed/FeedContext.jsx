import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../../utils/api';
import { useAuth } from '../../Pages/Auth/AuthContext';

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
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { user: currentUser } = useAuth();

  // Load posts from MongoDB
  const loadPosts = async (pageNum = 1, refresh = false) => {
    try {
      setLoading(true);
      console.log('🔄 Loading posts from: feed/posts');
      
      const response = await API.get('feed/posts');
      
      console.log('✅ Posts loaded successfully:', response.data);
      
      if (refresh || pageNum === 1) {
        setPosts(response.data);
      } else {
        setPosts(prev => [...prev, ...response.data]);
      }
      
      setHasMore(response.data.length === 10);
      setPage(pageNum);
    } catch (error) {
      console.error('❌ Error loading posts from database:', error);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Fallback to localStorage
  const loadFromLocalStorage = () => {
    const savedPosts = localStorage.getItem('socialFeedPosts');
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        setPosts(parsedPosts);
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
    }
  };

  // Initial load
  useEffect(() => {
    loadPosts(1);
  }, []);

  // Add new post to MongoDB
  const addPost = async (newPost) => {
    console.log('🔄 addPost called with:', newPost);
    
    try {
      const postData = {
        content: newPost.content,
        images: newPost.images || [], // ✅ Make sure images are included
        authorId: currentUser._id
      };

      console.log('📤 Sending to feed/posts:', postData);

      const response = await API.post('feed/posts', postData);
      console.log('✅ Post created in MongoDB:', response.data);
      
      setPosts(prevPosts => [response.data, ...prevPosts]);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error creating post:', error);
      
      // Fallback: Add to local state
      const localPost = {
        ...newPost,
        id: Date.now(),
        _id: `local_${Date.now()}`,
        author: {
          _id: currentUser._id,
          name: currentUser.name,
          email: currentUser.email,
          userType: currentUser.userType,
          university: currentUser.university,
          company: currentUser.company,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=004030&color=fff`
        },
        timestamp: 'Just now',
        createdAt: new Date().toISOString(),
        likes: [],
        comments: [],
        shares: 0
      };
      
      setPosts(prevPosts => [localPost, ...prevPosts]);
      localStorage.setItem('socialFeedPosts', JSON.stringify([localPost, ...posts]));
      
      return localPost;
    }
  };

  // Like/unlike post in MongoDB
  const likePost = async (postId) => {
    try {
      // Optimistic update
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post._id === postId || post.id === postId) {
            const isLiked = Array.isArray(post.likes) 
              ? post.likes.includes(currentUser._id)
              : post.liked;
            
            return {
              ...post,
              likes: isLiked 
                ? post.likes.filter(id => id !== currentUser._id)
                : [...(post.likes || []), currentUser._id],
              liked: !isLiked
            };
          }
          return post;
        })
      );

      // ✅ Consistent API call without leading slash
      await API.patch(`feed/posts/${postId}/like`, { 
        userId: currentUser._id 
      });

    } catch (error) {
      console.error('Error liking post:', error);
      loadPosts(1, true);
    }
  };

  // Add comment to post in MongoDB
  const addComment = async (postId, commentText) => {
    try {
      // ✅ Consistent API call without leading slash and correct field name
      const response = await API.post(`feed/posts/${postId}/comments`, {
        text: commentText,
        authorId: currentUser._id // ✅ Changed from 'author' to 'authorId'
      });

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId ? response.data : post
        )
      );

    } catch (error) {
      console.error('Error adding comment:', error);
      
      // Fallback: Add comment locally
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post._id === postId || post.id === postId) {
            return {
              ...post,
              comments: [
                ...post.comments,
                {
                  _id: `comment_${Date.now()}`,
                  text: commentText,
                  author: {
                    _id: currentUser._id,
                    name: currentUser.name,
                    email: currentUser.email,
                    userType: currentUser.userType,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=004030&color=fff`
                  },
                  createdAt: new Date().toISOString()
                }
              ]
            };
          }
          return post;
        })
      );
    }
  };

  // Share post
  const sharePost = async (postId) => {
    console.log('🔄 sharePost called with postId:', postId);
    
    try {
      // Optimistic update
      setPosts(prevPosts =>
        prevPosts.map(post =>
          (post._id === postId || post.id === postId)
            ? { ...post, shares: (post.shares || 0) + 1 }
            : post
        )
      );

      // ✅ Consistent API call without leading slash
      await API.patch(`feed/posts/${postId}/share`);

    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  // Load more posts for infinite scroll
  const loadMorePosts = () => {
    if (!loading && hasMore) {
      loadPosts(page + 1);
    }
  };

  // Refresh posts
  const refreshPosts = () => {
    loadPosts(1, true);
  };

  const value = {
    posts,
    addPost,
    likePost,
    addComment,
    sharePost,
    loading,
    hasMore,
    loadMorePosts,
    refreshPosts
  };

  return (
    <FeedContext.Provider value={value}>
      {children}
    </FeedContext.Provider>
  );
};