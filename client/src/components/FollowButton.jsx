import React, { useState } from 'react';

const FollowButton = ({ following, onClick, disabled = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  let label = following ? 'Following' : 'Follow';
  if (following && isHovered) {
    label = 'Unfollow';
  }

  return (
    <button
      type="button"
      className={`btn follow-btn ${following ? 'is-following' : 'not-following'}`}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {label}
    </button>
  );
};

export default FollowButton;
