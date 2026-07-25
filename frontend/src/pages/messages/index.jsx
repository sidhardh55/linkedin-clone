import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import UserLayout from '@/layout/UserLayout';
import styles from './style.module.css';
import { clientServer } from '@/config';
import { useSelector } from 'react-redux';
import { goToUserProfile } from '@/utils/navigation';

export default function MessagesPage() {
  const router = useRouter();
  const messagesEndRef = useRef(null);

  const currentUser = useSelector((state) => state.auth.user?.userId);

  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);

  const baseURL = "http://localhost:8080/";

  // 1. Fetch available chat users
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await clientServer.get('/get_all_users');
      const profiles = response.data?.profiles || [];
      const currentId = currentUser?._id;

      // Filter out self
      const otherUsers = profiles
        .map((p) => p.userId)
        .filter((u) => u && u._id !== currentId);

      setUsersList(otherUsers);

      // Select query user or first user if none selected
      const queryUserId = router.query.user;
      if (queryUserId) {
        const target = otherUsers.find((u) => u._id === queryUserId);
        if (target) setSelectedUser(target);
      } else if (otherUsers.length > 0 && !selectedUser) {
        setSelectedUser(otherUsers[0]);
      }
    } catch (err) {
      console.error("Error loading chat users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  // 2. Fetch conversation for selectedUser
  const fetchConversation = async (targetUser) => {
    if (!targetUser?._id) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await clientServer.get(`/user/get_messages?token=${token}&receiverId=${targetUser._id}`);
      setMessages(response.data?.messages || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Poll conversation every 3 seconds for active selectedUser
  useEffect(() => {
    if (!selectedUser) return;
    fetchConversation(selectedUser);

    const interval = setInterval(() => {
      fetchConversation(selectedUser);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedUser]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send Message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedUser) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const text = inputMessage.trim();
    setInputMessage("");

    try {
      await clientServer.post('/user/send_message', {
        token,
        receiverId: selectedUser._id,
        message: text
      });
      fetchConversation(selectedUser);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.messagingCard}>
          {/* Left Sidebar: Contacts */}
          <div className={styles.leftSidebar}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.title}>Messaging</h2>
            </div>

            <div className={styles.userList}>
              {loadingUsers ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#888' }}>
                  Loading contacts...
                </div>
              ) : usersList.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#888' }}>
                  No contacts found.
                </div>
              ) : (
                usersList.map((userItem) => {
                  const isSelected = selectedUser?._id === userItem._id;
                  return (
                    <div
                      key={userItem._id}
                      className={`${styles.userItem} ${isSelected ? styles.activeUserItem : ''}`}
                      onClick={() => setSelectedUser(userItem)}
                    >
                      <div
                        className={styles.avatarClickable}
                        onClick={(e) => {
                          e.stopPropagation();
                          goToUserProfile(router, userItem._id, currentUser?._id);
                        }}
                      >
                        {userItem.profilePicture && userItem.profilePicture !== 'default.jpg' ? (
                          <img
                            src={`${baseURL}${userItem.profilePicture}`}
                            alt={userItem.name}
                            className={styles.avatar}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className={styles.avatar}>
                            {userItem.name ? userItem.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}
                      </div>

                      <div className={styles.userInfo}>
                        <span className={styles.userName}>{userItem.name || 'User'}</span>
                        <span className={styles.userHandle}>@{userItem.username}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Main Window: Chat Conversation */}
          <div className={styles.chatWindow}>
            {selectedUser ? (
              <>
                <div
                  className={styles.chatHeader}
                  onClick={() => goToUserProfile(router, selectedUser._id, currentUser?._id)}
                  role="button"
                  tabIndex={0}
                >
                  {selectedUser.profilePicture && selectedUser.profilePicture !== 'default.jpg' ? (
                    <img
                      src={`${baseURL}${selectedUser.profilePicture}`}
                      alt={selectedUser.name}
                      className={styles.avatar}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className={styles.avatar}>
                      {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}

                  <div className={styles.chatTitleGroup}>
                    <h3 className={styles.chatTitle}>{selectedUser.name}</h3>
                    <span className={styles.chatSubtitle}>@{selectedUser.username} • Direct Message</span>
                  </div>
                </div>

                <div className={styles.messagesArea}>
                  {messages.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>No messages in this conversation yet.</p>
                      <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Send a message to start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isSentByMe = currentUser && (msg.senderId === currentUser._id || msg.senderId?._id === currentUser._id);
                      const formattedTime = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                      return (
                        <div
                          key={msg._id}
                          className={`${styles.messageRow} ${isSentByMe ? styles.sentRow : styles.receivedRow}`}
                        >
                          <div className={`${styles.bubble} ${isSentByMe ? styles.sentBubble : styles.receivedBubble}`}>
                            {msg.message}
                          </div>
                          <span className={styles.time}>{formattedTime}</span>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className={styles.inputBar}>
                  <input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Write a message..."
                    className={styles.messageInput}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                  />
                  <button
                    disabled={!inputMessage.trim()}
                    onClick={handleSendMessage}
                    className={styles.sendBtn}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <h3>Select a contact to start messaging</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
