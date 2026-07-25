import React from 'react';
import styles from './styles.module.css';
import { useRouter } from 'next/router';
import { goToUserProfile } from '@/utils/navigation';

export default function ProfileCard({ userProfile }) {
  const router = useRouter();
  const baseURL = "http://localhost:8080/";

  if (!userProfile) return null;

  const user = userProfile.userId || userProfile;

  return (
    <div className={styles.card}>
      <div className={styles.cover}></div>
      <div className={styles.body}>
        <div
          className={styles.clickableArea}
          onClick={() => goToUserProfile(router, user._id, user._id)}
        >
          {user.profilePicture && user.profilePicture !== 'default.jpg' ? (
            <img
              src={`${baseURL}${user.profilePicture}`}
              alt={user.name}
              className={styles.avatar}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className={styles.avatar}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}

          <h3 className={styles.name}>{user.name}</h3>
          <p className={styles.username}>@{user.username}</p>
        </div>

        {userProfile.currentPost && (
          <p className={styles.post}>{userProfile.currentPost}</p>
        )}

        {userProfile.bio && (
          <p className={styles.bio}>{userProfile.bio}</p>
        )}

        <div className={styles.divider}></div>

        <div className={styles.profileBtn} onClick={() => router.push('/profile')}>
          View Full Profile
        </div>
      </div>
    </div>
  );
}
