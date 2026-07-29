import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAboutUser } from '@/config/redux/action/authAction';
import { clientServer } from '@/config';
import UserLayout from '@/layout/UserLayout';
import styles from './style.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const avatarInputRef = useRef(null);

  const authState = useSelector((state) => state.auth);
  const profile = authState.user || {};
  const user = profile.userId || {};

  const baseURL = "http://localhost:8080/";

  // Edit states
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [currentPost, setCurrentPost] = useState("");
  const [bio, setBio] = useState("");

  // Past Work states
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [years, setYears] = useState("");

  // Education states
  const [showEduForm, setShowEduForm] = useState(false);
  const [school, setSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    dispatch(getAboutUser({ token }));
  }, [dispatch, router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (user.name) setName(user.name);
      if (user.username) setUsername(user.username);
      if (profile.currentPost) setCurrentPost(profile.currentPost);
      if (profile.bio) setBio(profile.bio);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [profile, user.name, user.username, profile.currentPost, profile.bio]);

  // Handle Profile Picture Upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("token", token);
    formData.append("profile_picture", file);

    try {
      await clientServer.post('/update_profile_picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage("Profile picture updated!");
      dispatch(getAboutUser({ token }));
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update profile picture");
    }
  };

  // Handle Personal Info Update
  const handleSaveInfo = async () => {
    const token = localStorage.getItem("token");

    try {
      // Update User fields (name, username)
      await clientServer.post('/user_update', { token, name, username });
      // Update Profile fields (bio, currentPost)
      await clientServer.post('/update_profile_data', { token, bio, currentPost });

      setMessage("Profile information saved successfully!");
      setIsEditingInfo(false);
      dispatch(getAboutUser({ token }));
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to save profile info");
    }
  };

  // Handle Add Work Experience
  const handleAddWork = async () => {
    if (!company.trim() || !position.trim()) return;
    const token = localStorage.getItem("token");
    const existingWork = profile.pastWork || [];
    const updatedPastWork = [...existingWork, { company, position, years }];

    try {
      await clientServer.post('/update_profile_data', { token, pastWork: updatedPastWork });
      setMessage("Work experience added!");
      setCompany(""); setPosition(""); setYears("");
      setShowWorkForm(false);
      dispatch(getAboutUser({ token }));
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add work experience");
    }
  };

  // Handle Delete Work Experience
  const handleDeleteWork = async (indexToDelete) => {
    const token = localStorage.getItem("token");
    const updatedPastWork = (profile.pastWork || []).filter((_, idx) => idx !== indexToDelete);

    try {
      await clientServer.post('/update_profile_data', { token, pastWork: updatedPastWork });
      setMessage("Work experience removed.");
      dispatch(getAboutUser({ token }));
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to remove work experience");
    }
  };

  // Handle Add Education
  const handleAddEducation = async () => {
    if (!school.trim() || !degree.trim()) return;
    const token = localStorage.getItem("token");
    const existingEdu = profile.education || [];
    const updatedEdu = [...existingEdu, { school, degree, fieldOfStudy }];

    try {
      await clientServer.post('/update_profile_data', { token, education: updatedEdu });
      setMessage("Education added!");
      setSchool(""); setDegree(""); setFieldOfStudy("");
      setShowEduForm(false);
      dispatch(getAboutUser({ token }));
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add education");
    }
  };

  // Handle Delete Education
  const handleDeleteEducation = async (indexToDelete) => {
    const token = localStorage.getItem("token");
    const updatedEdu = (profile.education || []).filter((_, idx) => idx !== indexToDelete);

    try {
      await clientServer.post('/update_profile_data', { token, education: updatedEdu });
      setMessage("Education removed.");
      dispatch(getAboutUser({ token }));
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to remove education");
    }
  };

  // Download Resume PDF
  const handleDownloadResume = async () => {
    if (!user._id) return;
    try {
      const response = await clientServer.get(`/user/download_resume?id=${user._id}`);
      if (response.data?.message) {
        window.open(`${baseURL}${response.data.message}`, '_blank');
      }
    } catch (err) {
      setMessage("Failed to generate PDF resume");
    }
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        {message && (
          <div style={{ background: '#e8f2fe', color: '#0a66c2', padding: '0.8rem 1.2rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: '500' }}>
            {message}
          </div>
        )}

        {/* Profile Header Card */}
        <div className={styles.profileCard}>
          <div className={styles.coverBanner}></div>
          <div className={styles.headerContent}>
            <div className={styles.avatarGroup}>
              {user.profilePicture && user.profilePicture !== 'default.jpg' ? (
                <img
                  src={`${baseURL}${user.profilePicture}`}
                  alt={user.name}
                  className={styles.avatar}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className={styles.avatar}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}

              <label className={styles.avatarEditBadge} title="Change Profile Picture">
                📷
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className={styles.hiddenInput}
                />
              </label>
            </div>

            <div className={styles.actionBtns}>
              <button onClick={handleDownloadResume} className={styles.resumeBtn}>
                📄 Download PDF Resume
              </button>
              <button onClick={() => setIsEditingInfo(!isEditingInfo)} className={styles.editToggleBtn}>
                {isEditingInfo ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {!isEditingInfo ? (
            <div className={styles.infoSection}>
              <h1 className={styles.name}>{user.name || 'Your Name'}</h1>
              <p className={styles.headline}>{profile.currentPost || 'Software Professional'}</p>
              <p className={styles.metaText}>@{user.username || 'username'} • {user.email}</p>

              {profile.bio ? (
                <p className={styles.bio}>{profile.bio}</p>
              ) : (
                <p className={styles.metaText} style={{ marginTop: '1rem', italic: 'true' }}>
                  No bio added yet. Click &quot;Edit Profile&quot; to add your bio.
                </p>
              )}
            </div>
          ) : (
            <div className={styles.infoSection}>
              <div className={styles.formBox}>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Full Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className={styles.input} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Username</label>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} className={styles.input} />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Headline / Current Position</label>
                  <input value={currentPost} onChange={(e) => setCurrentPost(e.target.value)} className={styles.input} placeholder="e.g. Senior Software Engineer at Tech Corp" />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>About / Bio</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} className={styles.input} style={{ minHeight: '80px' }} placeholder="Tell us about yourself..." />
                </div>

                <button onClick={handleSaveInfo} className={styles.saveBtn}>
                  Save Profile Changes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Work Experience Section */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Work Experience</h2>
            <button onClick={() => setShowWorkForm(!showWorkForm)} className={styles.addBtn}>
              {showWorkForm ? 'Close' : '+ Add Experience'}
            </button>
          </div>

          {showWorkForm && (
            <div className={styles.formBox} style={{ marginBottom: '1.5rem' }}>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Company Name</label>
                  <input value={company} onChange={(e) => setCompany(e.target.value)} className={styles.input} placeholder="e.g. Google" />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Position / Role</label>
                  <input value={position} onChange={(e) => setPosition(e.target.value)} className={styles.input} placeholder="e.g. Fullstack Developer" />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Years / Duration</label>
                <input value={years} onChange={(e) => setYears(e.target.value)} className={styles.input} placeholder="e.g. 2021 - 2024 (3 years)" />
              </div>

              <button onClick={handleAddWork} className={styles.saveBtn}>
                Save Experience
              </button>
            </div>
          )}

          <div className={styles.itemList}>
            {(!profile.pastWork || profile.pastWork.length === 0) ? (
              <p className={styles.metaText}>No work experience entries added yet.</p>
            ) : (
              profile.pastWork.map((work, idx) => (
                <div key={idx} className={styles.itemCard}>
                  <div>
                    <h3 className={styles.itemTitle}>{work.position}</h3>
                    <p className={styles.itemSubtitle}>{work.company}</p>
                    <p className={styles.itemMeta}>{work.years}</p>
                  </div>
                  <span onClick={() => handleDeleteWork(idx)} className={styles.deleteItemBtn}>
                    Delete
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Education Section */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Education</h2>
            <button onClick={() => setShowEduForm(!showEduForm)} className={styles.addBtn}>
              {showEduForm ? 'Close' : '+ Add Education'}
            </button>
          </div>

          {showEduForm && (
            <div className={styles.formBox} style={{ marginBottom: '1.5rem' }}>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>School / University</label>
                  <input value={school} onChange={(e) => setSchool(e.target.value)} className={styles.input} placeholder="e.g. Stanford University" />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Degree</label>
                  <input value={degree} onChange={(e) => setDegree(e.target.value)} className={styles.input} placeholder="e.g. Bachelor of Science" />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Field of Study / Years</label>
                <input value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} className={styles.input} placeholder="e.g. Computer Science (2018-2022)" />
              </div>

              <button onClick={handleAddEducation} className={styles.saveBtn}>
                Save Education
              </button>
            </div>
          )}

          <div className={styles.itemList}>
            {(!profile.education || profile.education.length === 0) ? (
              <p className={styles.metaText}>No education entries added yet.</p>
            ) : (
              profile.education.map((edu, idx) => (
                <div key={idx} className={styles.itemCard}>
                  <div>
                    <h3 className={styles.itemTitle}>{edu.school}</h3>
                    <p className={styles.itemSubtitle}>{edu.degree}</p>
                    <p className={styles.itemMeta}>{edu.fieldOfStudy}</p>
                  </div>
                  <span onClick={() => handleDeleteEducation(idx)} className={styles.deleteItemBtn}>
                    Delete
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
