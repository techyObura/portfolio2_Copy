import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

const PostPage = ({ menu }) => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const postApi = `${api}/posts/posts?slug=${postSlug}`;
  const recentPostsApi = `${api}/posts/posts?limit=3`;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(postApi);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message);
          setLoading(false);
          return;
        }

        if (res.ok) {
          setPost(data.posts[0]);
          setError(null);
          setLoading(false);
        }
      } catch (error) {
        console.log(error.message);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(recentPostsApi);
        const data = await res.json();

        if (res.ok) {
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchRecentPosts();
  }, []);

  if (loading)
    return (
      <div
        className={`relative  ${
          menu ? "top-[44vw] md:top-32 lg:top-20" : "top-20 lg:top-20 md:top-32"
        }  flex justify-center items-center min-h-screen`}
      >
        <Spinner size={"xl"} />
      </div>
    );
  return (
    <main
      className={` p-3 flex flex-col max-w-6xl mx-auto min-h-screen relative  ${
        menu ? "top-[40vw] md:top-32 lg:top-20" : "top-20 md:top-32 lg:top-20"
      } `}
    >
      <h1 className="mt-10 text-3xl p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button pill color={"gray"} size={"sx"}>
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className=" object-cover object-top"
      />
      {/* <div className="mt-10 p-3 h-[900px] w-full">
        <img
          src={post && post.image}
          alt={post && post.title}
          className=" object-cover object-top"
        />
      </div> */}
      <div className=" flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-sm">
        <span>{post && new Date(post.updatedAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post_content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className=" max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection postId={post._id} slug={post.slug} />
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent Projects</h1>
        <div className="flex flex-wrap w-[100%] justify-center items-center gap-5 mt-5">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
};

export default PostPage;
