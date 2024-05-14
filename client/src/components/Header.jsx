import React, { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { GoSearch } from "react-icons/go";
import { FaMoon, FaSun } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";
import { signOutSuccess } from "../redux/slices/userSlice";
import { toggleMenu } from "../redux/slices/menuSlice";
import api from "../api";

const Header = ({ menu, setMenu }) => {
  const signOut_api = `${api}/users/logout`;
  const dispatch = useDispatch();
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const user = currentUser;
  const [searchTerm, setSearchTerm] = useState("");

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
    <Navbar className="border-b-2 whitespace-nowrap fixed top-0 z-40 w-full">
      <Link
        to={"/"}
        className="self-center whitespace-nowrap text-3xl md:text-4xl font-semibold dark:text-white"
      >
        <span className="px-1 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg">
          Alfred Ochieng
        </span>{" "}
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="Search"
          rightIcon={GoSearch}
          className="hidden md:inline"
        />
      </form>
      <Button
        className=" w-12 h-12 hidden justify-center items-center"
        color={"gray"}
        pill
      >
        <GoSearch size={20} />
      </Button>
      <div className="flex gap-2 md:order-2 justify-center items-center">
        <Button
          className=" w-12 h-10 md:h-12 flex justify-center items-center "
          color={"gray"}
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          <span className="md:text-lg md:px-3">
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </span>
        </Button>
        {user ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt={user.username}
                img={user.profilePhoto}
                rounded
                className=" object-cover object-top"
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{user.username}</span>
              <span className="block text-sm font-medium truncate">
                {user.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <>
            <Link to={"/login"}>
              <Button gradientDuoTone={"purpleToBlue"} className="" outline>
                <span className=" md:text-lg md:px-2"> Sign In</span>
              </Button>
            </Link>
          </>
        )}
        <div onClick={() => setMenu(!menu)}>
          <Navbar.Toggle />
        </div>
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to={"/"} className="text-lg" onClick={() => setMenu(false)}>
            Home
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link
            to={"/about"}
            className="text-lg"
            onClick={() => setMenu(false)}
          >
            About
          </Link>
        </Navbar.Link>
        <Navbar.Link
          active={path === "/projects"}
          as={"div"}
          onClick={() => setMenu(false)}
        >
          <Link
            to={"/projects"}
            className="text-lg"
            onClick={() => setMenu(false)}
          >
            Projects
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
