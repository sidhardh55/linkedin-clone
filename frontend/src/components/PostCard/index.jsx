import React, { useState } from 'react';
import styles from './styles.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { incrementLikes, deletePost } from '@/config/redux/action/postAction';
import CommentSection from '../CommentSection';
import UserLink from '../UserLink';

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState(false);
  const currentUser = useSelector((state) => state.auth.user?.userId);

  const author = post.userId || {};
  const baseURL = "http://localhost:8080/";
  const isOwnPost = currentUser && (author._id === currentUser._id || author === currentUser._id);

  const handleLike = () => {
    dispatch(incrementLikes(post._id));
  };

  const handleDelete = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost({ token, post_id: post._id }));
    }
  };

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <UserLink
          user={author}
          avatarClassName={styles.avatar}
          nameClassName={styles.authorName}
        >
          <span className={styles.postTime}>@{author.username || 'user'} • {formattedDate}</span>
        </UserLink>

        {isOwnPost && (
          <button onClick={handleDelete} className={styles.deleteBtn}>
            Delete
          </button>
        )}
      </div>

      <div className={styles.postBody}>{post.body}</div>

      {post.media && (
        <div className={styles.mediaContainer}>
          {post.fileType && post.fileType.includes('mp4') ? (
            <video src={`${baseURL}${post.media}`} controls className={styles.postMedia} />
          ) : (
            <img
              src={`${baseURL}${post.media}`}
              alt="Post attachment"
              className={styles.postMedia}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
        </div>
      )}

      <div className={styles.statsRow}>
        <div className={styles.likeCount}>
          <span>👍</span>
          <span>{post.likes || 0} likes</span>
        </div>
      </div>

      <div className={styles.actionsRow}>
        <div onClick={handleLike} className={styles.actionBtn}>
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
          </svg>
          <span>Like</span>
        </div>

        <div onClick={() => setShowComments(!showComments)} className={`${styles.actionBtn} ${showComments ? styles.actionBtnActive : ''}`}>
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
          <span>Comment</span>
        </div>
      </div>

      {showComments && <CommentSection postId={post._id} />}
    </div>
  );
}
