import React, { useEffect, useState } from "react";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import api from "../api";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { FaCheck, FaTimes } from "react-icons/fa";
const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fetchUsersApi = `${api}/users/${currentUser._id}`;
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userIdDeleted, setUserIdDeleted] = useState(null);
  const delete_api = `${api}/users/delete/${currentUser._id}/${userIdDeleted}`;
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(fetchUsersApi, {
          headers: { authorization: "Bearer " + currentUser.accessToken },
        });
        const data = await res.json();

        if (res.ok) {
          setUsers(data.users);

          if (data.users.length > 9) {
            setShowMore(true);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPost();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`${fetchUsersApi}?startIndex=${startIndex}`, {
        headers: { authorization: "Bearer " + currentUser.accessToken },
      });

      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length > 9) {
          setShowMore(true);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
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
        setUsers((prev) => prev.filter((user) => user._id !== userIdDeleted));
        window.location === "/dashboard?tab=users";
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className=" table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className=" shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body key={user._id} className=" divide-y">
                <Table.Row className=" bg-white dark:border-x-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePhoto}
                      alt={user.username}
                      className=" w-9 h-9 lg:w-14 lg:h-14 rounded-full object-cover bg-gray-500"
                    />
                  </Table.Cell>
                  <Table.Cell className=" text-gray-900 dark:text-white">
                    {user.username}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell className=" cursor-pointer">
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdDeleted(user._id);
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
            you have no users
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
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color={"failure"} onClick={handleDeleteUser}>
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

export default DashUsers;
