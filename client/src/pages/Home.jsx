import React, { useContext, useEffect, useState } from 'react';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import { AuthContext } from '../context/AuthContext';
import { fetchPosts } from '../services/api';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetchPosts();
      setPosts(response.data);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('Failed to load posts. Please check your connection or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const updatePost = (postId, value) => {
    setPosts(current =>
      value
        ? current.map(post => (post._id === postId ? value : post))
        : current.filter(post => post._id !== postId)
    );
  };

  return (
    <div className="home-feed">
      <div className="feed-header">
        <h1 className="feed-title">Home</h1>
      </div>

      <CreatePost onCreated={newPost => setPosts(current => [newPost, ...current])} />

      {isLoading ? (
        <div className="card loading-card">
          <div className="spinner"></div>
          <p>Loading your feed...</p>
        </div>
      ) : error ? (
        <div className="card error-card">
          <p>{error}</p>
          <button type="button" className="btn btn-secondary" onClick={loadPosts}>
            Retry
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="card empty-card">
          <div className="empty-icon">🐦</div>
          <h3>Welcome to TwitterClone!</h3>
          <p>There are no posts yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="posts-container">
          {posts.map(post => (
            <Post
              key={post._id}
              post={post}
              user={user}
              onChanged={value => updatePost(post._id, value)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
