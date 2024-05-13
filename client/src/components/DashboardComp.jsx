import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

const DashboardComp = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState([]);
  const [totalPosts, setTotalPosts] = useState([]);
  const [totalComments, setTotalComments] = useState([]);
  const [lastMonthUsers, setLastMonthUsers] = useState([]);
  const [lastMonthPosts, setLastMonthPosts] = useState([]);
  const [lastMonthComments, setLastMonthComments] = useState([]);
  const fetchUsersApi = `${api}/users/${currentUser._id}?limit=5`;
  const fetchPostsApi = `${api}/posts/posts?limit=5`;
  const fetchCommentsApi = `${api}/comment/get?limit=5`;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(fetchUsersApi, {
          headers: { authorization: "Bearer " + currentUser.accessToken },
        });
        const data = await res.json();

        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch(fetchPostsApi, {
          headers: { authorization: "Bearer " + currentUser.accessToken },
        });
        const data = await res.json();

        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch(fetchCommentsApi, {
          headers: { authorization: "Bearer " + currentUser.accessToken },
        });
        const data = await res.json();

        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchComments();
      fetchPosts();
      fetchUsers();
    }
  }, [currentUser]);
  return (
    <div className="p-3 md:mx-auto">
      <div className=" flex flex-col md:flex-row md:flex-wrap gap-4 md:h-fit md:justify-center md:items-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-between md:justify-left w-[55%] md:w-auto md:flex-col">
              <div className="flex md:flex-col gap-1 items-center md:items-start">
                <h3 className=" text-gray-500 text-md uppercase">
                  Total Users
                </h3>
                <p className="text-2xl">{totalUsers}</p>
              </div>
              <div className="flex gap-2 text-sm">
                <div className="flex gap-1">
                  <span className=" text-green-500 flex items-center">
                    <HiArrowNarrowUp />
                    {lastMonthUsers}
                  </span>
                  <div className="text-gray-500">Last month</div>
                </div>{" "}
              </div>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-between md:justify-left w-[60%] md:w-auto md:flex-col">
              <div className="flex md:flex-col gap-1  items-center md:items-start">
                <h3 className=" text-gray-500 text-md uppercase">
                  Total Comments
                </h3>
                <p className="text-2xl">{totalComments}</p>
              </div>
              <div className="flex md:self-start gap-2 text-sm">
                <div className="flex gap-1">
                  <span className=" text-green-500 flex items-center">
                    <HiArrowNarrowUp />
                    {lastMonthComments}
                  </span>
                  <div className="text-gray-500">Last month</div>
                </div>{" "}
              </div>
            </div>
            <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-between md:justify-left w-[55%] md:w-auto md:flex-col">
              <div className="flex md:flex-col gap-1 items-center md:items-start">
                <h3 className=" text-gray-500 text-md uppercase">
                  Total Posts
                </h3>
                <p className="text-2xl">{totalPosts}</p>
              </div>
              <div className="flex gap-2 text-sm">
                <div className="flex gap-1">
                  <span className=" text-green-500 flex items-center">
                    <HiArrowNarrowUp />
                    {lastMonthPosts}
                  </span>
                  <div className="text-gray-500">Last month</div>
                </div>{" "}
              </div>
            </div>
            <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>
      </div>
      {/* Lower Section */}
      <div className="flex flex-wrap gap-5 mt-5 md:max-w-[70vw] self-end  md:flex-row md:flex-nowrap justify-center items-center md:items-start">
        <div className="flex flex-col w-full  md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between items-center p-3 text-sm font-semibold">
            <h3 className="text-center p-2">Recent users</h3>
            <Button gradientDuoTone={"purpleToPink"} outline>
              <Link to={"/dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <Table>
            <Table.Head>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <>
                  <Table.Body key={user._id} className=" divide-y">
                    <Table.Row className=" bg-white dark:bg-gray-800 dark:border-gray-700">
                      <Table.Cell>
                        <img
                          src={user.profilePhoto}
                          alt="user"
                          className="h-10 w-10 bg-gray-500 rounded-full"
                        />
                      </Table.Cell>
                      <Table.Cell>{user.username}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </>
              ))}
          </Table>
        </div>

        {/* Comments */}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between items-center p-3 text-sm font-semibold">
            <h3 className="text-center p-2">Recent comments</h3>
            <Button gradientDuoTone={"purpleToPink"} outline>
              <Link to={"/dashboard?tab=comments"}>See all</Link>
            </Button>
          </div>
          <Table className=" max-w-[40vw]">
            <Table.Head>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Comment likes</Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map((comment) => (
                <>
                  <Table.Body key={comment._id} className=" divide-y">
                    <Table.Row className=" bg-white dark:bg-gray-800 dark:border-gray-700">
                      <Table.Cell>
                        <p className=" line-clamp-2 max-w-[60%]">
                          {comment.content}
                        </p>
                      </Table.Cell>
                      <Table.Cell>{comment.likes}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </>
              ))}
          </Table>
        </div>

        {/* Posts */}

        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between items-center p-3 text-sm font-semibold">
            <h3 className="text-center p-2">Recent posts</h3>
            <Button gradientDuoTone={"purpleToPink"} outline>
              <Link to={"/dashboard?tab=posts"}>See all</Link>
            </Button>
          </div>
          <Table>
            <Table.Head>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {posts &&
              posts.map((post) => (
                <>
                  <Table.Body key={post._id} className=" divide-y">
                    <Table.Row className=" bg-white dark:bg-gray-800 dark:border-gray-700">
                      <Table.Cell>
                        <img
                          src={post.image}
                          alt="user"
                          className="h-10 w-10 bg-gray-500 rounded-full"
                        />
                      </Table.Cell>
                      <Table.Cell className=" w-32">
                        <p className="line-clamp-2"> {post.title}</p>
                      </Table.Cell>
                      <Table.Cell className="w-5">{post.category}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardComp;
