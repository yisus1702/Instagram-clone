import { useState, useCallback } from "react";
import useShowToast from "./useShowToast";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useSearchFollowersAndFollowing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const showToast = useShowToast();

  const getUserProfilesByIds = useCallback(
    async (userIds) => {
      setIsLoading(true);
      setUsers([]);
      try {
        const usersData = [];
        if (userIds.length > 0) {
          for (const userId of userIds) {
            const userDocRef = doc(firestore, "users", userId);
            const docSnapshot = await getDoc(userDocRef);

            if (docSnapshot.exists()) {
              usersData.push({ id: userId, ...docSnapshot.data() });
            } else {
              showToast("Error", `User ${userId} not found`, "error");
            }
          }
          setUsers(usersData);
        }
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  return { isLoading, getUserProfilesByIds, users };
};

export default useSearchFollowersAndFollowing;
