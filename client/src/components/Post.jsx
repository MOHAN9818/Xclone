import React, { useState } from 'react';
import { addComment, deletePost, toggleLike, getMediaUrl } from '../services/api';
import Comment from './Comment';

const Post = ({ post, user, onChanged }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentUserId = user?.id || user?._id;
  const postAuthorId = post.userId?._id || post.userId?.id || post.userId;
  const authorName = post.userId?.username || 'anonymous';
  const authorInitial = authorName.charAt(0).toUpperCase();

  const isOwner = Boolean(
    currentUserId && postAuthorId && postAuthorId.toString() === currentUserId.toString()
  );

  const liked = (post.likes || []).some(id => {
    const likeId = id?._id || id?.id || id;
    return likeId?.toString() === currentUserId?.toString();
  });

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year:
          new Date(post.createdAt).getFullYear() !== new Date().getFullYear()
            ? 'numeric'
            : undefined
      })
    : '';

  const handleLike = async () => {
    try {
      const response = await toggleLike(post._id);
      onChanged({ ...post, likes: response.data.likes });
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleReply = async event => {
    event.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmittingReply(true);
    try {
      const response = await addComment(post._id, commentText.trim());
      onChanged({
        ...post,
        comments: [...(post.comments || []), response.data]
      });
      setCommentText('');
      setShowComments(true);
    } catch (err) {
      console.error('Error adding reply:', err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setIsDeleting(true);
    try {
      await deletePost(post._id);
      onChanged(null);
    } catch (err) {
      console.error('Error deleting post:', err);
      setIsDeleting(false);
    }
  };

  return (
    <article className="card tweet-card">
      <div className="tweet-main">
        <div className="tweet-avatar">{authorInitial}</div>

        <div className="tweet-content-wrapper">
          <div className="tweet-header">
            <div className="tweet-user-info">
              <strong className="tweet-username">@{authorName}</strong>
              {formattedDate && <span className="tweet-date"> · {formattedDate}</span>}
            </div>
            {isOwner && (
              <button
                className="tweet-delete-btn"
                onClick={handleDelete}
                disabled={isDeleting}
                title="Delete tweet"
              >
                {isDeleting ? '⏳' : '🗑️'}
              </button>
            )}
          </div>

          {post.content && <p className="tweet-text">{post.content}</p>}

          {post.imageUrl && (
            <div className="tweet-image-container">
              <img
                src={getMediaUrl(post.imageUrl)}
                alt="Tweet attachment"
                className="tweet-image"
                loading="lazy"
              />
            </div>
          )}

          <div className="tweet-actions">
            <button
              type="button"
              className={`tweet-action-btn like-btn ${liked ? 'is-liked' : ''}`}
              onClick={handleLike}
              title={liked ? 'Unlike' : 'Like'}
            >
              <span className="action-icon">{liked ? '❤️' : '🤍'}</span>
              <span className="action-count">{post.likes?.length || 0}</span>
            </button>

            <button
              type="button"
              className="tweet-action-btn comment-toggle-btn"
              onClick={() => setShowComments(!showComments)}
              title="Comments"
            >
              <span className="action-icon">💬</span>
              <span className="action-count">{post.comments?.length || 0}</span>
            </button>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="tweet-comments-section">
          {(post.comments || []).length > 0 ? (
            <div className="comments-list">
              {post.comments.map(item => (
                <Comment key={item._id || Math.random()} comment={item} />
              ))}
            </div>
          ) : (
            <p className="no-comments-text">No comments yet. Be the first to reply!</p>
          )}

          <form className="comment-form" onSubmit={handleReply}>
            <input
              className="input-field comment-input"
              placeholder="Post your reply"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              maxLength="280"
              disabled={isSubmittingReply}
            />
            <button
              type="submit"
              className="btn btn-secondary btn-sm"
              disabled={isSubmittingReply || !commentText.trim()}
            >
              {isSubmittingReply ? '...' : 'Reply'}
            </button>
          </form>
        </div>
      )}
    </article>
  );
};

export default Post;
