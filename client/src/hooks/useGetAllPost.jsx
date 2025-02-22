import axios from "axios";
import { useEffect } from "react";
import React from "react";
import { useDispatch } from "react-redux";
import { setPosts } from "@/redux/postSlice.js";

const useGetAllPost = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPost = async () => {
      // will render at home page
      try {
        const response = await axios.get(
          "https://social-media-app-x1z2.onrender.com/api/v1/post/allpost",
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          dispatch(setPosts(response.data.posts));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPost();
  }, []);
};

export default useGetAllPost;
