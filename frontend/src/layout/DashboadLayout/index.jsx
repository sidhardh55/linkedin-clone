import React from 'react';
import styles from './index.module.css';
import ProfileCard from '@/components/ProfileCard';
import UserCard from '@/components/UserCard';
import { useSelector } from 'react-redux';

export default function DashboardLayout({ children }) {
  const userProfile = useSelector((state) => state.auth.user);

  return (
    <div className={styles.container}>
      <div className={styles.layoutGrid}>
        <div className={styles.leftColumn}>
          <ProfileCard userProfile={userProfile} />
        </div>

        <div className={styles.centerColumn}>
          {children}
        </div>

        <div className={styles.rightColumn}>
          <UserCard />
        </div>
      </div>
    </div>
  );
}
