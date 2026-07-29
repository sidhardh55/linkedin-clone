import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import UserLayout from '@/layout/UserLayout';
import styles from './style.module.css';
import { clientServer } from '@/config';
import UserLink from '@/components/UserLink';
import { useSelector } from 'react-redux';

export default function ConnectionsPage() {
  const router = useRouter();
  const currentUser = useSelector((state) => state.auth.user?.userId);
  const currentUserId = currentUser?._id;
  const [activeTab, setActiveTab] = useState('incoming');

  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      // 1. Incoming requests
      const incomingRes = await clientServer.get(`/user/user_connection_request?token=${token}`);
      setIncomingRequests(Array.isArray(incomingRes.data) ? incomingRes.data : []);

      // 2. Sent requests
      const sentRes = await clientServer.get(`/user/getConnectionRequests?token=${token}`);
      setSentRequests(sentRes.data?.conections || []);

      // 3. All users for discovery
      const usersRes = await clientServer.get('/get_all_users');
      setAllUsers(usersRes.data?.profiles || []);
    } catch (err) {
      console.error("Error fetching connections data:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchData]);

  // Handle Accept or Reject
  const handleRespondRequest = async (requestId, actionType) => {
    const token = localStorage.getItem("token");
    try {
      await clientServer.post('/user/accept_connection_request', {
        token,
        requestId,
        action_type: actionType
      });
      setMessage(`Request ${actionType === 'accept' ? 'accepted' : 'rejected'} successfully!`);
      fetchData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update request");
    }
  };

  // Handle Send Connection Request
  const handleSendRequest = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      await clientServer.post('/user/send_connection_request', {
        token,
        connectionId: userId
      });
      setMessage("Connection request sent!");
      fetchData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send request");
    }
  };

  const pendingIncoming = incomingRequests.filter((req) => req.status_accepted === null);

  const acceptedFromIncoming = incomingRequests
    .filter((req) => req.status_accepted === true)
    .map((req) => req.userId);

  const acceptedFromSent = sentRequests
    .filter((req) => req.status_accepted === true)
    .map((req) => req.connectionId);

  const allConnections = [...acceptedFromIncoming, ...acceptedFromSent].filter(Boolean);
  const uniqueConnections = allConnections.filter(
    (user, index, self) => user._id && self.findIndex((u) => u._id === user._id) === index
  );

  const connectedIds = new Set(uniqueConnections.map((u) => u._id));
  const pendingSentIds = new Set(
    sentRequests.filter((r) => r.status_accepted === null).map((r) => r.connectionId?._id || r.connectionId)
  );
  const pendingIncomingIds = new Set(pendingIncoming.map((r) => r.userId?._id || r.userId));

  const discoverUsers = allUsers.filter((profile) => {
    const memberId = profile.userId?._id;
    return memberId
      && memberId !== currentUserId
      && !connectedIds.has(memberId)
      && !pendingSentIds.has(memberId)
      && !pendingIncomingIds.has(memberId);
  });

  return (
    <UserLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>My Network & Connections</h1>

        {message && (
          <div style={{ background: '#e8f2fe', color: '#0a66c2', padding: '0.8rem 1.2rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: '500' }}>
            {message}
          </div>
        )}

        <div className={styles.tabsRow}>
          <div
            className={`${styles.tab} ${activeTab === 'incoming' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('incoming')}
          >
            Invitations
            {pendingIncoming.length > 0 && (
              <span className={styles.badge}>{pendingIncoming.length}</span>
            )}
          </div>

          <div
            className={`${styles.tab} ${activeTab === 'network' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('network')}
          >
            My Connections ({uniqueConnections.length})
          </div>

          <div
            className={`${styles.tab} ${activeTab === 'sent' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            Sent Requests ({sentRequests.length})
          </div>

          <div
            className={`${styles.tab} ${activeTab === 'discover' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('discover')}
          >
            Discover People
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            Loading network connections...
          </div>
        ) : (
          <>
            {/* Incoming Invitations Tab */}
            {activeTab === 'incoming' && (
              pendingIncoming.length === 0 ? (
                <div className={styles.emptyState}>
                  <h3>No pending connection invitations</h3>
                  <p style={{ marginTop: '0.5rem' }}>When someone invites you to connect, their request will appear here.</p>
                </div>
              ) : (
                <div className={styles.cardGrid}>
                  {pendingIncoming.map((req) => {
                    const sender = req.userId || {};
                    return (
                      <div key={req._id} className={styles.userCard}>
                        <UserLink
                          user={sender}
                          avatarClassName={styles.avatar}
                          nameClassName={styles.name}
                          layout="vertical"
                          showUsername
                        />

                        <div className={styles.actionsRow}>
                          <button onClick={() => handleRespondRequest(req._id, 'accept')} className={styles.acceptBtn}>
                            Accept
                          </button>
                          <button onClick={() => handleRespondRequest(req._id, 'reject')} className={styles.rejectBtn}>
                            Ignore
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* My Connections Tab */}
            {activeTab === 'network' && (
              uniqueConnections.length === 0 ? (
                <div className={styles.emptyState}>
                  <h3>You have no active connections yet</h3>
                  <p style={{ marginTop: '0.5rem' }}>Switch to the &quot;Discover People&quot; tab to start growing your professional network!</p>
                </div>
              ) : (
                <div className={styles.cardGrid}>
                  {uniqueConnections.map((connectionUser) => (
                      <div key={connectionUser._id} className={styles.userCard}>
                        <UserLink
                          user={connectionUser}
                          avatarClassName={styles.avatar}
                          nameClassName={styles.name}
                          layout="vertical"
                          showUsername
                        />

                        <div className={`${styles.statusBadge} ${styles.statusAccepted}`}>
                          ✓ Connected
                        </div>

                        <button
                          onClick={() => router.push(`/messages?user=${connectionUser._id}`)}
                          className={styles.messageBtn}
                        >
                          Message
                        </button>
                      </div>
                  ))}
                </div>
              )
            )}

            {/* Sent Requests Tab */}
            {activeTab === 'sent' && (
              sentRequests.length === 0 ? (
                <div className={styles.emptyState}>
                  <h3>No sent connection requests</h3>
                  <p style={{ marginTop: '0.5rem' }}>Requests you send to other professionals will show up here.</p>
                </div>
              ) : (
                <div className={styles.cardGrid}>
                  {sentRequests.map((req) => {
                    const recipient = req.connectionId || {};
                    const isAccepted = req.status_accepted === true;
                    const isRejected = req.status_accepted === false;

                    return (
                      <div key={req._id} className={styles.userCard}>
                        <UserLink
                          user={recipient}
                          avatarClassName={styles.avatar}
                          nameClassName={styles.name}
                          layout="vertical"
                          showUsername
                        />

                        <div className={`${styles.statusBadge} ${isAccepted ? styles.statusAccepted : isRejected ? styles.statusRejected : styles.statusPending}`}>
                          {isAccepted ? '✓ Connected' : isRejected ? 'Declined' : '⏳ Pending Response'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* Discover People Tab */}
            {activeTab === 'discover' && (
              discoverUsers.length === 0 ? (
                <div className={styles.emptyState}>
                  <h3>No new people to discover</h3>
                  <p style={{ marginTop: '0.5rem' }}>You&apos;re connected with everyone or have pending requests with all users.</p>
                </div>
              ) : (
                <div className={styles.cardGrid}>
                  {discoverUsers.map((profile) => {
                    const member = profile.userId || {};
                    if (!member._id) return null;

                    return (
                      <div key={profile._id || member._id} className={styles.userCard}>
                        <UserLink
                          user={member}
                          avatarClassName={styles.avatar}
                          nameClassName={styles.name}
                          layout="vertical"
                          showUsername
                        />

                        <div style={{ width: '100%', marginTop: '0.5rem' }}>
                          <button onClick={() => handleSendRequest(member._id)} className={styles.acceptBtn}>
                            + Connect
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </>
        )}
      </div>
    </UserLayout>
  );
}
