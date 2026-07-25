import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getAboutUser } from '@/config/redux/action/authAction';
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/DashboadLayout';
import CreatePostModal from '@/components/CreatePostModal';
import PostCard from '@/components/PostCard';

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const postsState = useSelector((state) => state.posts);
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    dispatch(getAllPosts());
    if (!authState.profileFetched) {
      dispatch(getAboutUser({ token }));
    }
  }, [dispatch, router, authState.profileFetched]);

  return (
    <UserLayout>
      <DashboardLayout>
        <CreatePostModal userProfile={authState.user} />

        {postsState.isLoading && postsState.posts.length === 0 ? (
          <div style={{ textAlignment: 'center', padding: '2rem', color: '#666' }}>
            Loading feed posts...
          </div>
        ) : postsState.posts.length === 0 ? (
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '10px', textAlign: 'center', border: '1px solid #e0e0e0' }}>
            <h3>No posts in your feed yet!</h3>
            <p style={{ color: '#666', marginTop: '0.5rem' }}>Be the first to share an update with your network.</p>
          </div>
        ) : (
          postsState.posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
