import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import api from "../api";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

const Login = ({ menu }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const api_url = `${api}/auth/login`;
  const [formData, setFormData] = useState({});

  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.email) {
      return dispatch(signInFailure("Please fill out all fields"));
    }

    try {
      dispatch(signInStart());
      const res = await fetch(api_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div
      className={`min-h-screen mt-16 relative sm:bg-[url('./alfred1.png')]  sm:bg-no-repeat sm:bg-auto sm:bg-left-top   ${
        menu ? "top-[40vw] sm:top-16" : "top-14"
      }`}
    >
      <div className="flex md:flex-row px-2 gap-5 md:items-center mx-auto flex-col bg-[url('./alfred1.png')]  bg-no-repeat bg-contain bg-right-top sm:bg-none">
        {/* Left */}
        <div className="flex-1 sm:pl-5 ">
          <Link
            to={"/"}
            className="whitespace-nowrap text-4xl md:text-5xl font-bold dark:text-white"
            style={{ fontFamily: "sans-serif" }}
          >
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg">
              Alfred Ochieng
            </span>{" "}
          </Link>
          <p className="mt-5 text-xl">This is Alfred Ochieng</p>
          <p className="text-xl">
            You can Sign in with your{" "}
            <p>
              email or with{" "}
              <span>
                {" "}
                <span className="text-blue-500">G</span>
                <span className="text-red-500">o</span>
                <span className="text-yellow-500">o</span>
                <span className="text-blue-500">g</span>
                <span className="text-green-500">l</span>
                <span className="text-red-500">e</span>
              </span>
            </p>
            .
          </p>
        </div>
        {/* Right */}
        <div className="flex-1 ">
          <form onSubmit={handleSubmit}>
            <div>
              <Label value="You email:" />
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            <div>
              <Label value="You password:" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>
            <div className="w-full mt-3">
              <Button
                className="w-full"
                gradientDuoTone={"purpleToPink"}
                outline
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size={"md"} />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  <>Sign In</>
                )}
              </Button>
            </div>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-3">
            <span>Do not have an account?</span>
            <Link to={"/register"} className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-1" color={"failure"}>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
