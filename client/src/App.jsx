import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Header from "./components/Header";
import FooterComp from "./components/FooterComp";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdmin from "./components/OnlyAdmin";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import SearchPage from "./pages/SearchPage";
import LoginProtect from "./components/LoginProtect";
import CreateProject from "./pages/CreateProject";
import UpdateProject from "./pages/UpdateProject";
import CreateSlider from "./pages/CreateSlider";

const App = () => {
  const [menu, setMenu] = useState(false);
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header setMenu={setMenu} menu={menu} />
      <Routes>
        <Route path="/" element={<Home menu={menu} />} />
        <Route path="/about" element={<About menu={menu} />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard menu={menu} />} />
        </Route>
        <Route path="/projects" element={<Projects menu={menu} />} />
        <Route element={<OnlyAdmin />}>
          <Route path="/create-post" element={<CreatePost menu={menu} />} />
          <Route
            path="/update-post/:postId"
            element={<UpdatePost menu={menu} />}
          />
          <Route
            path="/update-project/:projectId"
            element={<UpdateProject />}
          />
        </Route>
        <Route element={<LoginProtect />}>
          <Route path="/register" element={<Register menu={menu} />} />
          <Route path="/login" element={<Login menu={menu} />} />
        </Route>
        <Route path="/posts/:postSlug" element={<PostPage menu={menu} />} />
        <Route path="/all-posts" element={<SearchPage menu={menu} />} />
        <Route path="/create-project" element={<CreateProject menu={menu} />} />
        <Route path="/create-slide" element={<CreateSlider menu={menu} />} />
      </Routes>
      <FooterComp menu={menu} />
    </BrowserRouter>
  );
};

export default App;
