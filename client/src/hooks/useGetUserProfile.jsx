import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) {
      console.warn("⚠️ No userId provided to useGetUserProfile!");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        console.log("🔵 Fetching profile for userId:", userId);
        const res = await axios.get(
          `https://social-media-app-x1z2.onrender.com/api/v1/user/${userId}/profile`,
          { withCredentials: true }
        );

        console.log("🟣 API Response:", res.data);

        if (res.data.success) {
          const userProfile = res.data.user || {};

          // Ensure arrays are always defined to avoid `.length` errors
          userProfile.posts = userProfile.posts || [];
          userProfile.followers = userProfile.followers || [];
          userProfile.following = userProfile.following || [];

          //  console.log("🟢 Dispatching userProfile to Redux:", userProfile);
          dispatch(setUserProfile(userProfile));
        }
      } catch (error) {
        console.error("🔴 API Error:", error);
      }
    };

    fetchUserProfile();
  }, [userId, dispatch]);
};

export default useGetUserProfile;
