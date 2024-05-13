import { Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import {
  HiArrowRight,
  HiChartPie,
  HiDocumentText,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import api from "../api";
import { signOutSuccess } from "../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";

const DashSidebar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab, setTab] = useState("");
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);

  const signOut_api = `${api}/users/logout`;

  const handleSignOut = async () => {
    try {
      const res = await fetch(signOut_api, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56 md:fixed left-0 top-20 ">
      <Sidebar.Items>
        <Sidebar.ItemGroup className=" flex flex-col gap-1">
          {currentUser.isAdmin && (
            <Link to={"/dashboard?tab=dash"}>
              <Sidebar.Item active={tab === "dash"} icon={HiChartPie} as="div">
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <Link to={"/dashboard?tab=posts"}>
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocumentText}
                as="div"
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to={"/dashboard?tab=users"}>
              <Sidebar.Item
                active={tab === "users"}
                icon={HiOutlineUserGroup}
                as="div"
              >
                Users
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to={"/dashboard?tab=comments"}>
              <Sidebar.Item
                active={tab === "comments"}
                icon={HiOutlineUserGroup}
                as="div"
              >
                Comments
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to={"/dashboard?tab=sliders"}>
              <Sidebar.Item
                active={tab === "sliders"}
                icon={HiOutlineShieldCheck}
                as="div"
              >
                Sliders
              </Sidebar.Item>
            </Link>
          )}
          <Link to={"/dashboard?tab=projects"}>
            <Sidebar.Item
              active={tab === "projects"}
              icon={HiDocumentText}
              as="div"
            >
              Projects
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
            icon={HiArrowRight}
            className=" cursor-pointer"
            onClick={handleSignOut}
          >
            Sign out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
