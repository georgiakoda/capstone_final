import React from "react";

function PostCard({ post }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h6 className="card-subtitle mb-2 text-muted">r/{post.subreddit}</h6>
        <p className="card-text"><strong>Emotion:</strong> {post.max_emotion}</p>
        <p className="card-text">{post.text}</p>
      </div>
    </div>
  );
}

export default PostCard;
