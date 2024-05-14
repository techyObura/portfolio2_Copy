import React, { useEffect, useState } from "react";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import api from "../api";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";

const DashComments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fetchCommentsApi = `${api}/comment/get`;
  const [comments, setComments] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [commentIdDeleted, setCommentIdDeleted] = useState(null);
  const [loading, setLoading] = useState(false);
  const delete_api = `${api}/comments/deleteComment/${commentIdDeleted}`;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(fetchCommentsApi, {
          headers: { authorization: "Bearer " + currentUser.accessToken },
        });
        const data = await res.json();

        if (res.ok) {
          setComments(data.comments);
          setLoading(false);
          console.log(data.comments);

          if (data.comments.length > 9) {
            setShowMore(true);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`${fetchCommentsApi}?startIndex=${startIndex}`, {
        headers: { authorization: "Bearer " + currentUser.accessToken },
      });

      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => [...prev, ...data.comments]);
        if (data.comments.length > 9) {
          setShowMore(true);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(delete_api, {
        method: "DELETE",
        headers: { authorization: "Bearer " + currentUser.accessToken },
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdDeleted)
        );
        window.location === "/dashboard?tab=comments";
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="table-auto overflow-x-scroll w-[85%] md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && comments && comments.length > 0 ? (
        <>
          <Table hoverable className=" shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body key={comment._id} className=" divide-y">
                <Table.Row className=" bg-white dark:border-x-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell className=" text-gray-900 dark:text-white">
                    {comment.numberOfLikes}
                  </Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell className=" cursor-pointer">
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdDeleted(comment._id);
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
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-5"
            >
              Show more...
            </button>
          )}
        </>
      ) : (
        <>
          <p>
            Dear <span className=" capitalize">{currentUser.username}</span>,
            you have no comments
          </p>
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
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color={"failure"} onClick={handleDeleteComment}>
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

export default DashComments;
