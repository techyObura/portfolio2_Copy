import React, { useEffect, useState } from "react";
import api from "../api";
import { Link, useLocation } from "react-router-dom";
import PostCard from "../components/PostCard";
import { FaArrowDown } from "react-icons/fa";
import { Button } from "flowbite-react";
import { useSelector } from "react-redux";

const SearchPage = ({ menu }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const path = useLocation().pathname;
  const fetchPostsApi = `${api}/posts/posts?limit=100000`;

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(fetchPostsApi);
      const data = await res.json();

      if (res.ok) {
        setPosts(data.posts);
      }
    };

    if (path === "/all-posts") {
      fetchPosts();
    }
  }, [path === "/all-posts"]);
  console.log(posts);
  return (
    <div
      className={`relative ${
        menu ? "top-[55vw] md:top-32 lg:top-24" : "top-32 md:top-32 lg:top-32"
      } `}
    >
      <div className="p-3  flex flex-col items-center justify-center">
        {path === "/all-posts" && (
          <div
            className={` fixed py-1  w-[100vw] md:w-[90vw] rounded-md shadow-md h-[1px] pb-1 bg-gray-200 dark:bg-teal-500 z-10 ${
              menu ? "top-[44vw] md:top-[70px]" : "top-[70px]"
            }`}
          >
            <h4 className="text-2xl sm:text-3xl pb-2 bg-gray-200 shadow-md dark:bg-teal-500 mt-0  text-center  ">
              Articles
            </h4>
          </div>
        )}
        <div className="w-full flex flex-col justify-center items-center gap-6">
          {!currentUser && (
            <div className="flex flex-col m-0  gap-2">
              <p className=" whitespace-nowrap text-sm m-0 ">
                Kindly login to see more informative articles!{" "}
              </p>
              <span className="flex flex-col items-center gap-1">
                <FaArrowDown size={30} className=" animate-bounce" />
                <Link to={"/login"}>
                  {" "}
                  <Button outline>Sign in</Button>{" "}
                </Link>{" "}
              </span>
            </div>
          )}
          <div className="flex flex-wrap gap-4 justify-center items-center ">
            {posts &&
              posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
