import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { BASE_URL, goToUserProfile, getUserId } from '@/utils/navigation';
import styles from './styles.module.css';

export default function UserLink({
  user,
  avatarClassName,
  nameClassName,
  showName = true,
  showUsername = false,
  layout = 'horizontal',
  children,
}) {
  const router = useRouter();
  const currentUser = useSelector((state) => state.auth.user?.userId);
  const currentUserId = getUserId(currentUser);
  const userId = getUserId(user);

  if (!user || !userId) return null;

  const handleClick = (e) => {
    e.stopPropagation();
    goToUserProfile(router, userId, currentUserId);
  };

  const avatarContent = user.profilePicture && user.profilePicture !== 'default.jpg' ? (
    <img
      src={`${BASE_URL}${user.profilePicture}`}
      alt={user.name || 'User'}
      className={avatarClassName || styles.avatar}
      onError={(e) => { e.target.style.display = 'none'; }}
    />
  ) : (
    <div className={avatarClassName || styles.avatar}>
      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
    </div>
  );

  return (
    <div
      className={`${styles.userLink} ${layout === 'vertical' ? styles.vertical : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick(e); }}
    >
      {avatarContent}
      {(showName || showUsername || children) && (
        <div className={styles.textGroup}>
          {showName && (
            <span className={nameClassName || styles.name}>{user.name || 'User'}</span>
          )}
          {showUsername && user.username && (
            <span className={styles.username}>@{user.username}</span>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
