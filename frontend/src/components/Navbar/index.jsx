import React, { useEffect, useState } from 'react';
import styles from "./styles.module.css";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/config/redux/reducer/authReducer';
import { getAboutUser } from '@/config/redux/action/authAction';
import { clientServer } from '@/config';
import { goToUserProfile } from '@/utils/navigation';

export default function NavBarComponent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem("token") && !authState.profileFetched) {
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }
  }, [dispatch, authState.profileFetched]);

  useEffect(() => {
    const fetchPendingCount = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await clientServer.get(`/user/user_connection_request?token=${token}`);
        const data = Array.isArray(response.data) ? response.data : [];
        const pending = data.filter((item) => item.status_accepted === null).length;
        setPendingCount(pending);
      } catch (err) {
        console.error("Error fetching notification count:", err);
      }
    };

    if (authState.profileFetched) {
      fetchPendingCount();
      const interval = setInterval(fetchPendingCount, 30000);
      return () => clearInterval(interval);
    }
  }, [authState.profileFetched, router.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const currentPath = router.pathname;
  const user = authState.user?.userId;
  const baseURL = "http://localhost:8080/";

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <div className={styles.brand} onClick={() => router.push("/")}>
          <span className={styles.brandIcon}>in</span>
          <span>ProConnect</span>
        </div>

        {authState.profileFetched && user ? (
          <div className={styles.navLinks}>
            <div
              className={`${styles.navItem} ${currentPath === '/dashboard' || currentPath === '/feed' ? styles.navItemActive : ''}`}
              onClick={() => router.push('/dashboard')}
            >
              <svg className={styles.navIcon} fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <span>Feed</span>
            </div>

            <div
              className={`${styles.navItem} ${currentPath === '/connections' ? styles.navItemActive : ''}`}
              onClick={() => router.push('/connections')}
            >
              <svg className={styles.navIcon} fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
              <span>My Network</span>
            </div>

            <div
              className={`${styles.navItem} ${currentPath === '/messages' ? styles.navItemActive : ''}`}
              onClick={() => router.push('/messages')}
            >
              <svg className={styles.navIcon} fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
              </svg>
              <span>Messaging</span>
            </div>

            <div
              className={`${styles.navItem} ${currentPath === '/notifications' ? styles.navItemActive : ''}`}
              onClick={() => router.push('/notifications')}
            >
              <div className={styles.iconWrapper}>
                <svg className={styles.navIcon} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
                {pendingCount > 0 && (
                  <span className={styles.notifBadge}>{pendingCount > 9 ? '9+' : pendingCount}</span>
                )}
              </div>
              <span>Notifications</span>
            </div>

            <div
              className={`${styles.navItem} ${currentPath === '/profile' ? styles.navItemActive : ''}`}
              onClick={() => router.push('/profile')}
            >
              <svg className={styles.navIcon} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span>Profile</span>
            </div>

            <div className={styles.userMenu}>
              <div
                className={styles.avatarClickable}
                onClick={() => goToUserProfile(router, user._id, user._id)}
                title="View your profile"
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
              </div>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => router.push("/login")} className={styles.joinBtn}>
            Sign In / Register
          </button>
        )}
      </nav>
    </div>
  );
}
