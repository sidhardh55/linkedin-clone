import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { clientServer } from '@/config';
import UserLink from '../UserLink';
import { useSelector } from 'react-redux';

export default function UserCard() {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState({});
  const currentUser = useSelector((state) => state.auth.user?.userId);
  const currentUserId = currentUser?._id;

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const [usersRes, sentRes, incomingRes] = await Promise.all([
          clientServer.get('/get_all_users'),
          token ? clientServer.get(`/user/getConnectionRequests?token=${token}`) : Promise.resolve({ data: {} }),
          token ? clientServer.get(`/user/user_connection_request?token=${token}`) : Promise.resolve({ data: [] }),
        ]);

        const profiles = usersRes.data.profiles || [];
        const sent = sentRes.data?.conections || [];
        const incoming = Array.isArray(incomingRes.data) ? incomingRes.data : [];

        const connectedOrPendingIds = new Set();
        sent.forEach((r) => connectedOrPendingIds.add(r.connectionId?._id || r.connectionId));
        incoming.forEach((r) => {
          if (r.status_accepted === true || r.status_accepted === null) {
            connectedOrPendingIds.add(r.userId?._id || r.userId);
          }
        });

        const filtered = profiles.filter((profile) => {
          const userId = profile.userId?._id;
          return userId && userId !== currentUserId && !connectedOrPendingIds.has(userId);
        });

        setSuggestedUsers(filtered.slice(0, 5));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  const handleConnect = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await clientServer.post('/user/send_connection_request', {
        token,
        connectionId: userId
      });
      setSentRequests((prev) => ({ ...prev, [userId]: true }));
    } catch (err) {
      console.error("Error sending connection request:", err);
    }
  };

  if (suggestedUsers.length === 0) return null;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Add to your feed</h3>
      <div className={styles.userList}>
        {suggestedUsers.map((profile) => {
          const user = profile.userId || {};
          if (!user._id) return null;

          const isSent = sentRequests[user._id];

          return (
            <div key={profile._id || user._id} className={styles.userRow}>
              <UserLink
                user={user}
                avatarClassName={styles.avatar}
                nameClassName={styles.name}
                showUsername
              />

              <button
                disabled={isSent}
                onClick={() => handleConnect(user._id)}
                className={`${styles.connectBtn} ${isSent ? styles.connectBtnSent : ''}`}
              >
                {isSent ? 'Pending' : '+ Connect'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
