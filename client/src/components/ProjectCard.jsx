import React from "react";
import { Link } from "react-router-dom";
const ProjectCard = ({ project }) => {
  return (
    <div className="group relative w-full border h-[400px] overflow-hidden border-teal-500 hover:border-2 rounded-lg sm:w-[400px] transition-all duration-300">
      <Link to={project.url} target="_blank" rel="noopener noreferrer">
        <img
          src={project.image}
          alt="post cover"
          className="h-[260px] w-full object-cover object-top group-hover:h-[200px] transition-all duration-300 z-20"
        />
        <div className="p-3 flex flex-col gap-2 ">
          <p className=" text-lg font-semibold line-clamp-2">{project.title}</p>
          <span className=" italic text-sm line-clamp-1">
            {project.description}
          </span>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className=" z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-center text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 py-2 rounded-md !rounded-tl-none m-2"
          >
            See project
          </a>
        </div>
      </Link>
    </div>
  );
};

export default ProjectCard;
