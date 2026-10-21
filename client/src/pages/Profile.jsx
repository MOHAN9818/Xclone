import React, { useContext, useEffect, useState } from 'react';
import Post from '../components/Post';
import FollowButton from '../components/FollowButton';
import { AuthContext } from '../context/AuthContext';
import { fetchPosts, fetchUsers, fetchMe, toggleFollow } from '../services/api';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [isLoading, setIsLoading] = useState(true);
  const [followingActionId, setFollowingActionId] = useState(null);

  const currentUserId = user?.id || user?._id;

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [meRes, postRes, usersRes] = await Promise.all([
        fetchMe().catch(() => ({ data: user })),
        fetchPosts().catch(() => ({ data: [] })),
        fetchUsers().catch(() => ({ data: [] }))
      ]);

      if (meRes?.data) {
        setProfileData(meRes.data);
        if (updateUser) {
          updateUser(meRes.data);
        }
      }

      if (postRes?.data) {
        const myPosts = postRes.data.filter(post => {
          const authorId = post.userId?._id || post.userId?.id || post.userId;
          return authorId && authorId.toString() === currentUserId?.toString();
        });
        setPosts(myPosts);
      }

      if (usersRes?.data) {
        setUsers(usersRes.data);
      }
    } catch (err) {
      console.error('Error loading profile data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      loadData();
    }
  }, [currentUserId]);

  const updatePost = (id, value) => {
    setPosts(current =>
      value ? current.map(post => (post._id === id ? value : post)) : current.filter(post => post._id !== id)
    );
  };

  const handleFollowToggle = async targetUserId => {
    setFollowingActionId(targetUserId);
    try {
      const response = await toggleFollow(targetUserId);
      setUsers(current =>
        current.map(person =>
          person._id === targetUserId
            ? {
                ...person,
                isFollowing: response.data.following,
                followersCount: response.data.followersCount
              }
            : person
        )
      );

      // Refresh our own profile following count
      const meRes = await fetchMe();
      if (meRes?.data) {
        setProfileData(meRes.data);
        if (updateUser) updateUser(meRes.data);
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
    } finally {
      setFollowingActionId(null);
    }
  };

  const username = profileData?.username || user?.username || 'user';
  const email = profileData?.email || user?.email || '';
  const initial = username.charAt(0).toUpperCase();

  const followersCount =
    profileData?.followers?.length ?? profileData?.followersCount ?? 0;
  const followingCount =
    profileData?.following?.length ?? profileData?.followingCount ?? 0;

  return (
    <div className="profile-page">
      {/* Profile Header Card */}
      <div className="card profile-card">
        <div className="profile-banner"></div>
        <div className="profile-details-wrapper">
          <div className="profile-avatar-large">{initial}</div>
          <div className="profile-info">
            <h2 className="profile-name">{username}</h2>
            <p className="profile-handle">@{username}</p>
            {email && <p className="profile-email">📧 {email}</p>}

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-count">{posts.length}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-count">{followingCount}</span>
                <span className="stat-label">Following</span>
              </div>
              <div className="stat-item">
                <span className="stat-count">{followersCount}</span>
                <span className="stat-label">Followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          My Posts ({posts.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Who to Follow ({users.length})
        </button>
      </div>

      {isLoading ? (
        <div className="card loading-card">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      ) : activeTab === 'posts' ? (
        <div className="profile-posts-section">
          {posts.length === 0 ? (
            <div className="card empty-card">
              <p>You haven't posted any tweets yet.</p>
            </div>
          ) : (
            posts.map(post => (
              <Post
                key={post._id}
                post={post}
                user={user}
                onChanged={value => updatePost(post._id, value)}
              />
            ))
          )}
        </div>
      ) : (
        <div className="card who-to-follow-card">
          <h3>People you might know</h3>
          {users.length === 0 ? (
            <p className="no-users-text">No other users found on the platform yet.</p>
          ) : (
            <div className="users-list">
              {users.map(person => (
                <div className="follow-row" key={person._id}>
                  <div className="follow-user-meta">
                    <div className="user-mini-avatar">
                      {(person.username || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong className="user-meta-name">@{person.username}</strong>
                      <span className="user-meta-followers">
                        {person.followersCount || person.followers?.length || 0} followers
                      </span>
                    </div>
                  </div>
                  <FollowButton
                    following={person.isFollowing}
                    disabled={followingActionId === person._id}
                    onClick={() => handleFollowToggle(person._id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
