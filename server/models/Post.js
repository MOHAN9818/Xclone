const mongoose = require('mongoose');
const commentSchema = require('./Comment');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: {
    type: String,
    trim: true,
    maxLength: 280,
    validate: {
      validator: function(v) {
        // Must have either content text or an image
        return (v && v.trim().length > 0) || Boolean(this.imageUrl);
      },
      message: 'Post must have either text or an image.'
    }
  },
  imageUrl: { type: String, default: null },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema]
}, { timestamps: true, collection: 'tweets' });

module.exports = mongoose.model('Post', postSchema);
