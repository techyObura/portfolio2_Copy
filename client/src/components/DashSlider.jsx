import React, { useEffect, useState } from "react";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import api from "../api";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";
const DashSlider = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fetchPostApi = `${api}/slider/getSlider`;
  const [userPosts, setUserPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postIdDeleted, setPostIdDeleted] = useState(null);
  const deletePostApi = `${api}/slider/deleteSlider/${postIdDeleted}`;
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(fetchPostApi);
        const data = await res.json();

        if (res.ok) {
          setUserPosts(data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };
    if (currentUser.isAdmin) {
      fetchPost();
    }
  }, [currentUser._id]);

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(deletePostApi, {
        method: "DELETE",
        headers: { authorization: "Bearer " + currentUser.accessToken },
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdDeleted)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  if (loading) return <p>Loading...</p>;
  console.log(userPosts);
  return (
    <div className=" table-auto sm:w-[85vw] overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts ? (
        <>
          <Table hoverable className=" w-full shadow-md">
            <Table.Head>
              <Table.HeadCell>Link to</Table.HeadCell>
              <Table.HeadCell>Slider Image</Table.HeadCell>
              <Table.HeadCell>Slide Title</Table.HeadCell>
              <Table.HeadCell>Slide subtitle</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body key={post._id} className=" divide-y">
                <Table.Row className=" bg-white dark:border-x-gray-700 dark:bg-gray-800">
                  <Table.Cell>{post.url ? post.url : "none"}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/posts/${post.slug}`}>
                      {post.image ? (
                        <>
                          <img
                            src={post.image}
                            alt={post.title}
                            className=" w-20 h-10 object-cover bg-gray-500"
                          />
                        </>
                      ) : (
                        <>none</>
                      )}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className=" text-gray-900 dark:text-white">
                      {post.title ? post.title : "none"}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    {post.subTitle ? post.subTitle : "none"}
                  </Table.Cell>
                  <Table.Cell className=" cursor-pointer">
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdDeleted(post._id);
                      }}
                      className="font-medium text-red-500 hover:underline"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <>
          <p>Dear {currentUser.username}, you have no post</p>
        </>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color={"failure"} onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color={"gray"} onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashSlider;
