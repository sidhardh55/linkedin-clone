import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import UserLayout from '@/layout/UserLayout';
import styles from './style.module.css';
import { clientServer } from '@/config';
import UserLink from '@/components/UserLink';

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await clientServer.get(`/user/user_connection_request?token=${token}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchNotifications();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchNotifications]);

  const handleAction = async (requestId, actionType) => {
    const token = localStorage.getItem("token");
    try {
      await clientServer.post('/user/accept_connection_request', {
        token,
        requestId,
        action_type: actionType
      });
      setMessage(`Request ${actionType === 'accept' ? 'accepted' : 'ignored'}!`);
      fetchNotifications();
    } catch (err) {
      setMessage("Failed to process action");
    }
  };

  const pendingNotifs = notifications.filter((item) => item.status_accepted === null);
  const recentAccepted = notifications.filter((item) => item.status_accepted === true);

  return (
    <UserLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Notifications & Invitations</h1>

        {message && (
          <div style={{ background: '#e8f2fe', color: '#0a66c2', padding: '0.8rem 1.2rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: '500' }}>
            {message}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            Loading notifications...
          </div>
        ) : pendingNotifs.length === 0 && recentAccepted.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>You have no new notifications</h3>
            <p style={{ marginTop: '0.5rem' }}>Connection requests and network activity notifications will appear here.</p>
          </div>
        ) : (
          <div className={styles.list}>
            {pendingNotifs.map((item) => {
              const sender = item.userId || {};
              return (
                <div key={item._id} className={styles.card}>
                  <div className={styles.left}>
                    <UserLink
                      user={sender}
                      avatarClassName={styles.avatar}
                      nameClassName={styles.heading}
                    >
                      <span className={styles.subtext}>
                        <strong>{sender.name || 'User'}</strong> sent you a connection request
                      </span>
                    </UserLink>
                  </div>

                  <div className={styles.actions}>
                    <button onClick={() => handleAction(item._id, 'accept')} className={styles.acceptBtn}>
                      Accept
                    </button>
                    <button onClick={() => handleAction(item._id, 'reject')} className={styles.ignoreBtn}>
                      Ignore
                    </button>
                  </div>
                </div>
              );
            })}

            {recentAccepted.map((item) => {
              const sender = item.userId || {};
              return (
                <div key={item._id} className={styles.card} style={{ opacity: 0.85 }}>
                  <div className={styles.left}>
                    <UserLink
                      user={sender}
                      avatarClassName={styles.avatar}
                    >
                      <div className={styles.textGroup}>
                        <span className={styles.heading}>
                          You are now connected with <strong>{sender.name || 'User'}</strong>
                        </span>
                        <span className={styles.subtext}>@{sender.username}</span>
                      </div>
                    </UserLink>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
