import React, { useState, useRef } from 'react';
import { createPost } from '../services/api';

const CreatePost = ({ onCreated }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be under 5MB');
        return;
      }
      setError('');
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const submit = async event => {
    event.preventDefault();
    if (!content.trim() && !image) return;

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      if (content.trim()) formData.append('content', content.trim());
      if (image) formData.append('image', image);

      const response = await createPost(formData);
      onCreated(response.data);

      setContent('');
      removeImage();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post tweet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const remaining = 280 - content.length;

  return (
    <div className="card create-post-card">
      <form onSubmit={submit}>
        <textarea
          className="input-field post-textarea"
          rows="3"
          placeholder="What's happening?"
          value={content}
          onChange={event => setContent(event.target.value)}
          maxLength="280"
          disabled={isSubmitting}
        />

        {preview && (
          <div className="image-preview-container">
            <img src={preview} alt="Preview" className="image-preview" />
            <button
              type="button"
              className="remove-image-btn"
              onClick={removeImage}
              title="Remove image"
            >
              ✕
            </button>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="create-post-actions">
          <div className="post-tools">
            <label className="file-upload-btn" title="Upload image">
              📷 Photo
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSubmitting}
                style={{ display: 'none' }}
              />
            </label>
            <span className={`char-counter ${remaining < 20 ? 'char-warning' : ''}`}>
              {remaining}
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || (!content.trim() && !image)}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
