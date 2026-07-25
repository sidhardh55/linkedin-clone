import React, { useState, useRef } from 'react';
import styles from './styles.module.css';
import { useDispatch } from 'react-redux';
import { createPost } from '@/config/redux/action/postAction';

export default function CreatePostModal({ userProfile }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [postBody, setPostBody] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const user = userProfile?.userId || userProfile;
  const baseURL = "http://localhost:8080/";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePostSubmit = () => {
    if (!postBody.trim() && !selectedFile) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("token", token);
    formData.append("body", postBody);
    if (selectedFile) {
      formData.append("media", selectedFile);
    }

    dispatch(createPost(formData));

    // Reset state
    setPostBody("");
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        {user?.profilePicture && user.profilePicture !== 'default.jpg' ? (
          <img
            src={`${baseURL}${user.profilePicture}`}
            alt={user.name}
            className={styles.avatar}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className={styles.avatar}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        )}

        <textarea
          value={postBody}
          onChange={(e) => setPostBody(e.target.value)}
          placeholder="Start a post, share your thoughts or updates..."
          className={styles.textarea}
        />
      </div>

      {previewUrl && (
        <div className={styles.mediaPreview}>
          <img src={previewUrl} alt="Upload preview" className={styles.previewImg} />
          <span className={styles.removeMediaBtn} onClick={handleRemoveFile}>✕</span>
        </div>
      )}

      <div className={styles.actionsRow}>
        <label className={styles.mediaUploadBtn}>
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z"/>
          </svg>
          <span>Media</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className={styles.hiddenFileInput}
          />
        </label>

        <button
          disabled={!postBody.trim() && !selectedFile}
          onClick={handlePostSubmit}
          className={styles.postBtn}
        >
          Post
        </button>
      </div>
    </div>
  );
}
