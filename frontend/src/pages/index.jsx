import Head from "next/head";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";
import styles from "@/styles/Home.module.css";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <UserLayout>
      <Head>
        <title>ProConnect - Professional Networking Platform</title>
        <meta name="description" content="Connect with colleagues, share updates, build your professional resume, and grow your network on ProConnect." />
      </Head>

      <main className={styles.heroSection}>
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.heroChip}>Empower your career network</div>
            <h1 className={styles.heroTitle}>
              Build your professional network with <span>bold connection</span> moments.
            </h1>
            <p className={styles.heroSubtitle}>
              ProConnect makes it effortless to share ideas, grow your personal brand, and build lasting career relationships in one polished community.
            </p>

            <div className={styles.actionGroup}>
              <button onClick={() => router.push('/login')} className={styles.primaryButton}>
                Get Started
              </button>
              <button onClick={() => router.push('/login')} className={styles.secondaryButton}>
                Explore Demo
              </button>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <strong>120K+</strong>
                <span>Professionals</span>
              </div>
              <div className={styles.statItem}>
                <strong>98%</strong>
                <span>Engagement rate</span>
              </div>
              <div className={styles.statItem}>
                <strong>4.9/5</strong>
                <span>Trusted platform</span>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.visualCardLarge}>
              <div className={styles.cardHeader}>
                <span>Community Pulse</span>
                <span className={styles.badge}>Live</span>
              </div>
              <div className={styles.profilePreview}>
                <img src="/images/home_connection.jpg" alt="Community connections" />
              </div>
              <div className={styles.cardBody}>
                <p>Trending now: authentic networking, meaningful posts, and career opportunities.</p>
                <div className={styles.cardMetrics}>
                  <div>
                    <strong>1.4K</strong>
                    <span>New connections</span>
                  </div>
                  <div>
                    <strong>520</strong>
                    <span>Active discussions</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.visualCardSmall}>
              <span>Featured</span>
              <strong>Design teams hiring now</strong>
            </div>
          </div>
        </div>
      </main>
    </UserLayout>
  );
}
