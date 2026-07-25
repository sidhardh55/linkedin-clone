import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, getComments, deleteComment } from '@/config/redux/action/postAction';
import UserLink from '../UserLink';

export default function CommentSection({ postId }) {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");
  const commentsMap = useSelector((state) => state.posts.commentsMap);
  const currentUser = useSelector((state) => state.auth.user?.userId);

  const comments = commentsMap[postId] || [];
  const baseURL = "http://localhost:8080/";

  useEffect(() => {
    if (postId) {
      dispatch(getComments(postId));
    }
  }, [dispatch, postId]);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    dispatch(addComment({ token, post_id: postId, commentBody: commentText }));
    setCommentText("");
  };

  const handleDeleteComment = (commentId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    dispatch(deleteComment({ token, comment_id: commentId, post_id: postId }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.commentInputRow}>
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className={styles.inputField}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddComment();
          }}
        />
        <button
          disabled={!commentText.trim()}
          onClick={handleAddComment}
          className={styles.addBtn}
        >
          Comment
        </button>
      </div>

      <div className={styles.commentsList}>
        {comments.length === 0 ? (
          <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => {
            const author = comment.userId || {};
            const isOwnComment = currentUser && (author._id === currentUser._id || author === currentUser._id);

            return (
              <div key={comment._id} className={styles.commentCard}>
                <div className={styles.commentLeft}>
                  <UserLink
                    user={author}
                    avatarClassName={styles.commentAvatar}
                    nameClassName={styles.authorName}
                  >
                    <p className={styles.commentBody}>{comment.body}</p>
                  </UserLink>
                </div>

                {isOwnComment && (
                  <span
                    onClick={() => handleDeleteComment(comment._id)}
                    className={styles.deleteBtn}
                  >
                    Delete
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
