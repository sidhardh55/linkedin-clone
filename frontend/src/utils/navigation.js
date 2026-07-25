export const BASE_URL = "http://localhost:8080/";

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
