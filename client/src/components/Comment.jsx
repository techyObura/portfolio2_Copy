import React, { useEffect, useState } from "react";
import api from "../api";
import moment from "moment";
import timezone from "moment-timezone";
import { FaThumbsUp, FaTrash } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [commentEdit, setCommentEdit] = useState(comment.content);
  const userApi = `${api}/users/get/${comment.userId}`;
  const editCommentApi = `${api}/comments/editComment/${comment._id}`;
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(userApi);
        const data = await res.json();

        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUser();
  }, [comment]);

  const handleEditComment = () => {
    setIsEditing(true);
    setCommentEdit(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(editCommentApi, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + currentUser.accessToken,
        },
        body: JSON.stringify({
          content: commentEdit,
        }),
      });

      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, commentEdit);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200 "
          src={user.profilePhoto}
          alt={user.username}
        />
      </div>
      <div className=" flex-1">
        <div className="">
          <span className=" font-bold mr-1 text-sm truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="w-full px-2 min-h-24 text-gray-700 bg-gray-200 rounded-md resize-none focus:outline-none focus:bg-gray-100 pt-1 pb-2"
              value={commentEdit}
              onChange={(e) => setCommentEdit(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-sm mt-1">
              <Button
                type="button"
                className=""
                size={"sm"}
                gradientDuoTone={"purpleToBlue"}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                className=""
                size={"sm"}
                gradientDuoTone={"purpleToBlue"}
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className=" text-gray-500 pb-2">{comment.content}</p>
            <div className="flex justify-center items-center gap-3 pt-2 text-sm border-t dark:border-gray-700 max-w-fit">
              <button
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
                type="button"
                onClick={() => onLike(comment._id)}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className=" text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <div className="flex gap-7">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-blue-500"
                      onClick={handleEditComment}
                    >
                      edit
                    </button>
                    <button
                      type="button"
                      className="text-red-400 hover:text-red-800"
                      onClick={() => onDelete(comment._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
