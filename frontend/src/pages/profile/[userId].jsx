import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import UserLayout from '@/layout/UserLayout';
import { clientServer } from '@/config';
import { BASE_URL, goToUserProfile } from '@/utils/navigation';
import styles from './style.module.css';

export default function UserProfilePage() {
  const router = useRouter();
  const { userId } = router.query;
  const currentUser = useSelector((state) => state.auth.user?.userId);
  const currentUserId = currentUser?._id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    if (!userId) return;

    if (userId === currentUserId) {
      router.replace("/profile");
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await clientServer.get(`/user/profile/${userId}`);
        setProfile(response.data);
      } catch (err) {
        setMessage(err.response?.data?.message || "Profile not found");
      } finally {
        setLoading(false);
      }
    };

    const fetchConnectionStatus = async () => {
      try {
        const [incomingRes, sentRes] = await Promise.all([
          clientServer.get(`/user/user_connection_request?token=${token}`),
          clientServer.get(`/user/getConnectionRequests?token=${token}`),
        ]);

        const incoming = Array.isArray(incomingRes.data) ? incomingRes.data : [];
        const sent = sentRes.data?.conections || [];

        const incomingMatch = incoming.find(
          (r) => (r.userId?._id || r.userId) === userId
        );
        if (incomingMatch) {
          if (incomingMatch.status_accepted === true) setConnectionStatus('connected');
          else if (incomingMatch.status_accepted === false) setConnectionStatus('rejected');
          else setConnectionStatus('incoming');
          return;
        }

        const sentMatch = sent.find(
          (r) => (r.connectionId?._id || r.connectionId) === userId
        );
        if (sentMatch) {
          if (sentMatch.status_accepted === true) setConnectionStatus('connected');
          else if (sentMatch.status_accepted === false) setConnectionStatus('rejected');
          else setConnectionStatus('pending');
          return;
        }

        setConnectionStatus('none');
      } catch (err) {
        console.error("Error fetching connection status:", err);
      }
    };

    fetchProfile();
    fetchConnectionStatus();
  }, [userId, currentUserId, router]);

  const handleConnect = async () => {
    const token = localStorage.getItem("token");
    try {
      await clientServer.post('/user/send_connection_request', {
        token,
        connectionId: userId,
      });
      setConnectionStatus('pending');
      setMessage("Connection request sent!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send request");
    }
  };

  const handleAccept = async (requestId) => {
    const token = localStorage.getItem("token");
    try {
      const incomingRes = await clientServer.get(`/user/user_connection_request?token=${token}`);
      const incoming = Array.isArray(incomingRes.data) ? incomingRes.data : [];
      const match = incoming.find((r) => (r.userId?._id || r.userId) === userId);
      if (!match) return;

      await clientServer.post('/user/accept_connection_request', {
        token,
        requestId: match._id,
        action_type: 'accept',
      });
      setConnectionStatus('connected');
      setMessage("You are now connected!");
    } catch (err) {
      setMessage("Failed to accept request");
    }
  };

  const handleMessage = () => {
    router.push(`/messages?user=${userId}`);
  };

  const handleDownloadResume = async () => {
    try {
      const response = await clientServer.get(`/user/download_resume?id=${userId}`);
      if (response.data?.message) {
        window.open(`${BASE_URL}${response.data.message}`, '_blank');
      }
    } catch (err) {
      setMessage("Failed to generate PDF resume");
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            Loading profile...
          </div>
        </div>
      </UserLayout>
    );
  }

  if (!profile) {
    return (
      <UserLayout>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <h3>{message || "Profile not found"}</h3>
            <button onClick={() => router.back()} className={styles.backBtn}>
              Go Back
            </button>
          </div>
        </div>
      </UserLayout>
    );
  }

  const user = profile.userId || {};

  return (
    <UserLayout>
      <div className={styles.container}>
        {message && (
          <div className={styles.toast}>{message}</div>
        )}

        <button onClick={() => router.back()} className={styles.backBtn} style={{ marginBottom: '1rem' }}>
          ← Back
        </button>

        <div className={styles.profileCard}>
          <div className={styles.coverBanner}></div>
          <div className={styles.headerContent}>
            <div className={styles.avatarGroup}>
              {user.profilePicture && user.profilePicture !== 'default.jpg' ? (
                <img
                  src={`${BASE_URL}${user.profilePicture}`}
                  alt={user.name}
                  className={styles.avatar}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className={styles.avatar}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>

            <div className={styles.actionBtns}>
              {connectionStatus === 'none' && (
                <button onClick={handleConnect} className={styles.connectBtn}>
                  + Connect
                </button>
              )}
              {connectionStatus === 'pending' && (
                <button disabled className={styles.pendingBtn}>
                  Request Pending
                </button>
              )}
              {connectionStatus === 'incoming' && (
                <button onClick={handleAccept} className={styles.connectBtn}>
                  Accept Connection
                </button>
              )}
              {connectionStatus === 'connected' && (
                <button onClick={handleMessage} className={styles.messageBtn}>
                  Message
                </button>
              )}
              <button onClick={handleDownloadResume} className={styles.resumeBtn}>
                Download Resume
              </button>
            </div>
          </div>

          <div className={styles.infoSection}>
            <h1 className={styles.name}>{user.name || 'User'}</h1>
            <p className={styles.headline}>{profile.currentPost || 'Professional'}</p>
            <p className={styles.metaText}>@{user.username || 'username'}</p>

            {profile.bio ? (
              <p className={styles.bio}>{profile.bio}</p>
            ) : (
              <p className={styles.metaText} style={{ marginTop: '1rem' }}>
                No bio added yet.
              </p>
            )}
          </div>
        </div>

        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Work Experience</h2>
          </div>
          <div className={styles.itemList}>
            {(!profile.pastWork || profile.pastWork.length === 0) ? (
              <p className={styles.metaText}>No work experience listed.</p>
            ) : (
              profile.pastWork.map((work, idx) => (
                <div key={idx} className={styles.itemCard}>
                  <div>
                    <h3 className={styles.itemTitle}>{work.position}</h3>
                    <p className={styles.itemSubtitle}>{work.company}</p>
                    <p className={styles.itemMeta}>{work.years}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Education</h2>
          </div>
          <div className={styles.itemList}>
            {(!profile.education || profile.education.length === 0) ? (
              <p className={styles.metaText}>No education listed.</p>
            ) : (
              profile.education.map((edu, idx) => (
                <div key={idx} className={styles.itemCard}>
                  <div>
                    <h3 className={styles.itemTitle}>{edu.school}</h3>
                    <p className={styles.itemSubtitle}>{edu.degree}</p>
                    <p className={styles.itemMeta}>{edu.fieldOfStudy}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
