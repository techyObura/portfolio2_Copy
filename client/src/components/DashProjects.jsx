import React, { useEffect, useState } from "react";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import api from "../api";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";
const DashProjects = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fetchProjectsApi = `${api}/projects/getProjects`;
  const [projects, setProjects] = useState([]);
  const [totalProjects, setTotalProjects] = useState(null);
  const [lastMonthProjects, setLastMonthProjects] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [projectIdDeleted, setProjectIdDeleted] = useState(null);
  const deleteProjectApi = `${api}/projects/deleteProject/${projectIdDeleted}`;
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(fetchProjectsApi);
        const data = await res.json();

        if (res.ok) {
          setProjects(data.projects);
          setLastMonthProjects(data.lastMonthProjects);
          setTotalProjects(data.totalProjects);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser) {
      fetchProjects();
    }
  }, [currentUser._id]);

  const handleDeletePost = async () => {
    try {
      const res = await fetch(deleteProjectApi, {
        method: "DELETE",
        headers: { authorization: "Bearer " + currentUser.accessToken },
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        setProjects((prev) =>
          prev.filter((project) => project._id !== projectIdDeleted)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className=" table-auto overflow-x-scroll md:flex md:justify-start md:items-start gap-3 md:mx-auto w-full sm:w-[80%] p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 max-h-28 w-full rounded-md shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-between md:justify-left w-[60%] md:w-auto md:flex-col">
              <div className="flex md:flex-col gap-1  items-center md:items-start">
                <h3 className=" text-gray-500 text-md uppercase">
                  Total Projects
                </h3>
                <p className="text-2xl">{totalProjects}</p>
              </div>
              <div className="flex md:self-start gap-2 text-sm">
                <div className="flex gap-1">
                  <span className=" text-green-500 flex items-center">
                    <HiArrowNarrowUp />
                    {lastMonthProjects}
                  </span>
                  <div className="text-gray-500">Last month</div>
                </div>{" "}
              </div>
            </div>
            <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>
      </>
      {projects.length > 0 ? (
        <>
          <Table hoverable className=" shadow-md md:w-[50vw] mt-5 md:mt-0 ">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Project Image</Table.HeadCell>
              <Table.HeadCell>Project Title</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              {currentUser.isAdmin && (
                <>
                  <Table.HeadCell>Delete</Table.HeadCell>
                  <Table.HeadCell>
                    <span>Edit</span>
                  </Table.HeadCell>
                </>
              )}
            </Table.Head>
            {projects.map((project) => (
              <Table.Body key={project._id} className=" divide-y">
                <Table.Row className=" bg-white dark:border-x-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={project.url}>
                      <img
                        src={project.image}
                        alt={project.title}
                        className=" w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/posts/${project.url}`}
                      className=" text-gray-900 dark:text-white"
                    >
                      {project.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell className=" text-gray-900 dark:text-white">
                    {project.isComplete ? "Completed" : "Incomplete"}
                  </Table.Cell>
                  {currentUser.isAdmin && (
                    <>
                      <Table.Cell className=" cursor-pointer">
                        <span
                          onClick={() => {
                            setShowModal(true);
                            setProjectIdDeleted(project._id);
                          }}
                          className="font-medium text-red-500 hover:underline"
                        >
                          Delete
                        </span>
                      </Table.Cell>
                      <Table.Cell className=" cursor-pointer">
                        <Link
                          to={`/update-project/${project._id}`}
                          className="text-teal-500"
                        >
                          <span className=" hover:underline">Edit</span>
                        </Link>
                      </Table.Cell>
                    </>
                  )}
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <>
          <p> no project</p>
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

export default DashProjects;
