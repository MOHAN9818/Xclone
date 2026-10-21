import React from 'react';

const Comment = ({ comment }) => {
  const username = comment.userId?.username || 'user';
  const initial = username.charAt(0).toUpperCase();

  const formattedDate = comment.createdAt
    ? new Date(comment.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      })
    : '';

  return (
    <div className="comment-item">
      <div className="comment-avatar">{initial}</div>
      <div className="comment-body">
        <div className="comment-header">
          <strong className="comment-author">@{username}</strong>
          {formattedDate && <span className="comment-date"> · {formattedDate}</span>}
        </div>
        <p className="comment-text">{comment.content}</p>
      </div>
    </div>
  );
};

export default Comment;
