import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const Home = ({ menu }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [slides, setSliders] = useState([]);
  const [slideHeight, setSlideHeight] = useState(false);
  const fetchPostsApi = `${api}/posts/posts?limit=9`;
  const fetchSliders = `${api}/slider/getSlider`;

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(fetchPostsApi);
      const data = await res.json();

      if (res.ok) {
        setPosts(data.posts);
      }
    };

    const fetchSlider = async () => {
      const res = await fetch(fetchSliders);
      const data = await res.json();

      if (res.ok) {
        setSliders(data);
      }
    };

    fetchPosts();
    fetchSlider();
  }, []);

  console.log(slides);
  return (
    <div
      className={` min-h-[100vh]  relative ${
        menu ? "top-[46vw] sm:top-16" : "top-16"
      }`}
    >
      {slides.length > 0 ? (
        <>
          <div
            className={` ${
              slideHeight ? "new-slide-container" : "slide-container"
            } `}
            style={{ maxHeight: "content-fit" }}
          >
            <Fade
              autoplay={true}
              pauseOnHover={true}
              duration={10000}
              transitionDuration={300}
              infinite={true}
              arrows={false}
            >
              {slides.map((slide, index) => {
                const { image, description, title, subTitle, url, urlName } =
                  slide;
                if (image) {
                  () => setSlideHeight(false);
                  return (
                    <div key={index} className="flex flex-col sm:flex-row ">
                      <div className="flex sm:flex-1 flex-col gap-6 lg:p-28 p-3">
                        <h2 className="text-3xl font-bold lg:text-6xl">
                          {title}
                        </h2>
                        <p className=" text-gray-500 text-xs sm:text-sm">
                          {subTitle}
                        </p>
                        <Link
                          to={`/${url}`}
                          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
                        >
                          {urlName}
                        </Link>
                      </div>
                      <div className="sm:flex-1 sm:flex sm:justify-left p-3">
                        <img
                          className=" object-cover object-top"
                          style={{
                            width: "100%",
                            height: "400px",
                            borderRadius: "20px",
                          }}
                          src={image}
                        />
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      className="flex flex-col gap-6 lg:p-28 p-3"
                    >
                      <h2 className="text-3xl font-bold lg:text-6xl">
                        {title}
                      </h2>
                      <p className=" text-gray-500 text-xs sm:text-sm">
                        {subTitle}
                      </p>
                      <Link
                        to={url}
                        className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
                      >
                        {urlName}
                      </Link>
                    </div>
                  );
                }
              })}
            </Fade>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-6 lg:p-28 p-3">
            <h2 className="text-3xl font-bold lg:text-6xl">
              Alfred Ochieng welcomes you to this page
            </h2>
            <p className=" text-gray-500 text-xs sm:text-sm">
              Here you'll find my portfolio, projects, articles I have written
              and tutorials I have prepared on topics such as Web development,
              software engineering and programming languages
            </p>
            <Link
              to={"/all-posts"}
              className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
            >
              View all posts
            </Link>
          </div>
        </>
      )}

      <div className="p-3 lg:px-5 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="max-w-7xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <>
            <div className=" w-full flex flex-col items-center gap-7">
              <h2 className="text-2xl font-semibold text-center">
                Recent posts
              </h2>
              <div className="flex flex-wrap  gap-4">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              <Link
                to={"/all-posts"}
                className="text-lg text-teal-500 hover:underline text-center"
              >
                View all posts
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
