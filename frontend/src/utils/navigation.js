const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const BASE_URL = apiBaseUrl.endsWith('/') ? apiBaseUrl : `${apiBaseUrl}/`;

export function goToUserProfile(router, userId, currentUserId) {
  if (!userId) return;
  if (currentUserId && userId === currentUserId) {
    router.push("/profile");
  } else {
    router.push(`/profile/${userId}`);
  }
}

export function getUserId(user) {
  if (!user) return null;
  return user._id || user;
}
