import React, { useEffect, useState } from "react";
import api from "../api";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ProjectCard from "../components/ProjectCard";
import { Button } from "flowbite-react";
import { FaArrowDown } from "react-icons/fa";

const Projects = ({ menu }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [projects, setProjects] = useState([]);
  const path = useLocation().pathname;
  const fetchPostsApi = `${api}/projects/getProjects`;

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch(fetchPostsApi);
      const data = await res.json();

      if (res.ok) {
        setProjects(data.projects);
      }
    };

    if (path === "/projects") {
      fetchProjects();
    }
  }, [path === "/projects"]);
  console.log(projects);
  return (
    <div
      className={`relative min-h-screen ${
        menu ? "top-[48vw] md:top-32 lg:top-32" : "top-32 md:top-32 lg:top-32"
      } `}
    >
      <div className=" px-3  flex flex-col items-center justify-center">
        {path === "/projects" && (
          <div
            className={` fixed py-1   w-[100vw] md:w-[90vw] rounded-md shadow-md h-[1px] pb-1 bg-gray-200 dark:bg-teal-500 z-10 ${
              menu ? "top-[45vw] md:top-[70px]" : "top-[60px] md:top-[70px]"
            }`}
          >
            <h4 className="text-2xl sm:text-3xl pb-2 bg-gray-200 shadow-md dark:bg-teal-500 mt-0  text-center  ">
              Projects{" "}
            </h4>
          </div>
        )}
        <div className="w-full flex flex-col gap-6 justify-center items-center">
          {!currentUser && (
            <div className="flex flex-col m-0  gap-8">
              <p className=" whitespace-nowrap text-sm m-0 ">
                Kindly login to see all my projects...{" "}
              </p>
              <span className="flex flex-col items-center gap-4">
                <FaArrowDown size={30} className=" animate-bounce" />
                <Link to={"/login"}>
                  {" "}
                  <Button outline>Sign in</Button>{" "}
                </Link>{" "}
              </span>
            </div>
          )}
          <div className="flex w-full flex-wrap gap-4 justify-center items-center ">
            {projects &&
              projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
