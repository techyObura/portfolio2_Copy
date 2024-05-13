import { Alert, Button, Textarea, Spinner, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const CommentSection = ({ postId }) => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState(null);
  const postCommentApi = `${api}/comments/create`;
  const getCommentsApi = `${api}/comments/${postId}`;
  const deleteCommentApi = `${api}/comments/deleteComment`;
  const [loading, setLoading] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  setTimeout(() => {
    setCommentError(null);
  }, 7000);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (comment.length > 200) {
      return;
    }

    try {
      const res = await fetch(postCommentApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + currentUser.accessToken,
        },
        body: JSON.stringify({
          content: comment,
          userId: currentUser._id,
          postId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      } else {
        setCommentError(data.message);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  const handleLike = async (commentId) => {
    try {
      setLoadingB(true);
      if (!currentUser) {
        navigate("/login");
        return;
      }

      const res = await fetch(`${api}/comments/likeComment/${commentId}`, {
        method: "PUT",
        headers: { authorization: "Bearer " + currentUser.accessToken },
      });
      const data = await res.json();
      if (res.ok) {
        setLoadingB(false);
        setComments(
          comments.map((comment) => {
            if (comment._id === commentId) {
              return {
                ...comment,
                likes: data.likes,
                numberOfLikes: data.likes.length,
              };
            } else {
              return comment;
            }
          })
        );
      } else {
        setLoadingB(false);
      }
    } catch (error) {
      setLoadingB(false);
      console.log(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(getCommentsApi);
        const data = await res.json();

        if (res.ok) {
          setComments(data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };
    getComments();
  }, [postId]);

  const handleEdit = async (comment, editedComment) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedComment } : c
      )
    );
  };

  const handleCommentDelete = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      const res = await fetch(`${deleteCommentApi}/${commentId}`, {
        method: "DELETE",
        headers: { authorization: "Bearer " + currentUser.accessToken },
      });

      if (res.ok) {
        setComments(comments.filter((comment) => comment._id !== commentId));
        setShowModal(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className=" max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <>
          <div className="flex items-center gap-2 my-5 text-gray-500 text-md">
            <p>Signed in as: </p>
            <img
              className="h-7 w-7 object-cover rounded-full"
              src={currentUser.profilePhoto}
              alt=""
            />
            <Link
              to={"/dashboard?tab=profile"}
              className="text-sm text-cyan-600 hover:underline"
            >
              @{currentUser.username}
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="text-sm text-teal-500 my-5 flex gap-1">
            You must sign in to comment.
            <Link className="text-blue-500 hover:underline" to={"/login"}>
              Sign in
            </Link>
          </div>
        </>
      )}
      {currentUser && (
        <form
          className=" border border-teal-500 rounded-md p-3"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add a comment..."
            rows={"3"}
            maxLength={"200"}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-sm">
              {200 - comment.length} characters remaining
            </p>
            <Button
              outline
              gradientDuoTone={"purpleToBlue"}
              type="submit"
              disabled={comment.length > 200}
            >
              submit
            </Button>
          </div>
          {commentError && (
            <>
              <Alert color={"failure"} className="my-3">
                {commentError}
              </Alert>
            </>
          )}
        </form>
      )}
      {loading ? (
        <div className="flex justify-center items-center mt-11">
          <Spinner size={"xl"} />
        </div>
      ) : (
        <>
          {comments.length === 0 ? (
            <>
              <p className="text-sm my-5">
                <i>No comments yet!</i>
              </p>
            </>
          ) : (
            <>
              <div className="text-sm my-5 flex items-center gap-1">
                <p>Comments</p>
                <div className="border border-gray-400 py-1 px-2 rounded-sm ">
                  <p>{comments.length}</p>
                </div>
              </div>
              {comments.map((comment) => (
                <div key={comment._id}>
                  <Comment
                    comment={comment}
                    onLike={handleLike}
                    onEdit={handleEdit}
                    onDelete={(commentId) => {
                      setShowModal(true);
                      setCommentToDelete(commentId);
                    }}
                  />
                </div>
              ))}
            </>
          )}
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
              <Button
                color={"failure"}
                onClick={() => handleCommentDelete(commentToDelete)}
              >
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

export default CommentSection;
