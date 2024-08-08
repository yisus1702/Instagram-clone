import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useUserProfileStore from "../store/userProfileStore";
import useShowToast from "./useShowToast";
import { firestore } from "../firebase/firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const useFollowUser = (userId) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);
  const { userProfile, setUserProfile } = useUserProfileStore();
  const deleteFollowing = useUserProfileStore((state) => state.deleteFollowing);
  const addFollowing = useUserProfileStore((state) => state.addFollowing);
  const showToast = useShowToast();

  const handleFollowUser = async () => {
    setIsUpdating(true);
    try {
      const currentUserRef = doc(firestore, "users", authUser.uid);
      const userToFollowOrUnfollorRef = doc(firestore, "users", userId);

      // Actualizar la lista de seguidos del usuario actual
      await updateDoc(currentUserRef, {
        following: isFollowing ? arrayRemove(userId) : arrayUnion(userId),
      });

      // Actualizar la lista de seguidores del usuario que se sigue o se deja de seguir
      await updateDoc(userToFollowOrUnfollorRef, {
        followers: isFollowing
          ? arrayRemove(authUser.uid)
          : arrayUnion(authUser.uid),
      });

      if (isFollowing) {
        // Unfollow
        const updatedFollowing = authUser.following.filter(
          (uid) => uid !== userId
        );
        setAuthUser({
          ...authUser,
          following: updatedFollowing,
        });

        if (userProfile && userProfile.uid === authUser.uid) {
          deleteFollowing(userId);
        }

        if (userProfile && userProfile.uid === userId) {
          setUserProfile({
            ...userProfile,
            followers: userProfile.followers.filter(
              (uid) => uid !== authUser.uid
            ),
          });
        }

        localStorage.setItem(
          "user-info",
          JSON.stringify({
            ...authUser,
            following: updatedFollowing,
          })
        );
        setIsFollowing(false);
      } else {
        // Follow
        const updatedFollowing = Array.from(
          new Set([...authUser.following, userId])
        );
        setAuthUser({
          ...authUser,
          following: updatedFollowing,
        });

        if (userProfile && userProfile.uid === authUser.uid) {
          addFollowing(userId);
        }

        if (userProfile && userProfile.uid === userId) {
          setUserProfile({
            ...userProfile,
            followers: Array.from(
              new Set([...userProfile.followers, authUser.uid])
            ),
          });
        }

        localStorage.setItem(
          "user-info",
          JSON.stringify({
            ...authUser,
            following: updatedFollowing,
          })
        );
        setIsFollowing(true);
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      const isFollowing = authUser.following.includes(userId);
      setIsFollowing(isFollowing);
    }
  }, [authUser, userId]);

  return { isUpdating, isFollowing, handleFollowUser };
};

export default useFollowUser;
