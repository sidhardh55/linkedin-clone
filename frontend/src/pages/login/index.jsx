import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import styles from './style.module.css';
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';

export default function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [userLoginMethod, setUserLoginMethod] = useState(true);
  const [email, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (authState.loggedIn || localStorage.getItem('token')) {
      router.push('/dashboard');
    }
  }, [authState.loggedIn, router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      dispatch(emptyMessage());
      setLocalError('');
    }, 0);

    return () => window.clearTimeout(timer);
  }, [userLoginMethod, dispatch]);

  const handleRegister = () => {
    if (!username.trim() || !name.trim() || !email.trim() || !password.trim()) {
      setLocalError('Please fill out all fields.');
      return;
    }
    setLocalError('');
    dispatch(registerUser({ username, password, email, name }));
  };

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter your email and password.');
      return;
    }
    setLocalError('');
    dispatch(loginUser({ email, password }));
  };

  const messageText = localError || (typeof authState.message === 'object' ? authState.message?.message : authState.message);

  return (
    <div className={styles.page}>
      <div className={styles.heroBackground} />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h1 className={styles.title}>{userLoginMethod ? 'Sign In' : 'Sign Up'}</h1>
              <p className={styles.subtitle}>{userLoginMethod ? 'Enter your credentials to access your account.' : 'Create an account to get started.'}</p>
            </div>
            <div className={styles.toggleGroup}>
              <button
                type="button"
                onClick={() => setUserLoginMethod(true)}
                className={`${styles.toggleBtn} ${userLoginMethod ? styles.active : ''}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setUserLoginMethod(false)}
                className={`${styles.toggleBtn} ${!userLoginMethod ? styles.active : ''}`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {messageText && (
            <div className={`${styles.alertBox} ${authState.isError || localError ? styles.alertError : styles.alertSuccess}`}>
              {messageText}
            </div>
          )}

          <div className={styles.form}>
            {!userLoginMethod && (
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Full name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="John Doe"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Username</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="johndoe"
                  />
                </div>
              </>
            )}

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Email address</label>
              <input
                value={email}
                onChange={(e) => setEmailAddress(e.target.value)}
                className={styles.inputField}
                type="email"
                placeholder="name@company.com"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                type="password"
                placeholder={userLoginMethod ? 'Enter your password' : 'Create a strong password'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    userLoginMethod ? handleLogin() : handleRegister();
                  }
                }}
              />
            </div>

            <button
              type="button"
              disabled={authState.isLoading}
              onClick={userLoginMethod ? handleLogin : handleRegister}
              className={styles.submitBtn}
            >
              {authState.isLoading ? 'Loading...' : userLoginMethod ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          <div className={styles.footer}>
            {userLoginMethod ? (
              <p>
                New here?{' '}
                <button className={styles.linkButton} type="button" onClick={() => setUserLoginMethod(false)}>
                  Create Account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button className={styles.linkButton} type="button" onClick={() => setUserLoginMethod(true)}>
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
