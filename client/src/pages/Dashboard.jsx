import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";
import DashProjects from "../components/DashProjects";
import DashSlider from "../components/DashSlider";

const Dashboard = ({ menu }) => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);
  return (
    <div
      className={`min-h-[100vh] flex flex-col md:flex-row relative  ${
        menu ? "top-[48vw] md:top-32 lg:top-20" : "top-20 md:top-32 lg:top-20"
      } `}
    >
      <div className=" md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile */}
      {tab === "profile" && <DashProfile />}
      {/* posts */}
      {tab === "posts" && <DashPosts />}
      {/* Users */}
      {tab === "users" && <DashUsers />}
      {/* comments */}
      {tab === "comments" && <DashComments />}
      {/* Dashboard */}
      {tab === "dash" && <DashboardComp />}
      {/* Projects */}
      {tab === "projects" && <DashProjects />}
      {/* Sliders */}
      {tab === "sliders" && <DashSlider />}
    </div>
  );
};

export default Dashboard;
