import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import api from "../api";
import OAuth from "../components/OAuth";

const Register = ({ menu }) => {
  const navigate = useNavigate();
  const api_url = `${api}/auth/create`;
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !pass || !confirmPass) {
      return setErrorMessage("Please fill out all fields");
    }

    if (pass !== confirmPass) {
      return setErrorMessage("Passwords do not match");
    }

    setFormData({ ...formData, password: pass });
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(api_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(null);
        return setErrorMessage(data.message);
      }
      setLoading(false);

      if (res.ok) {
        navigate("/login");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  setTimeout(() => {
    setErrorMessage(null);
  }, 7000);

  return (
    <div
      className={`min-h-screen mt-16 relative top-16 sm:bg-[url('./alfred1.png')]  sm:bg-no-repeat sm:bg-auto sm:bg-left-top ${
        menu ? "top-[44vw] sm:top-16" : "top-16"
      }`}
    >
      <div className="flex md:flex-row px-2 gap-5 md:items-center mx-auto flex-col bg-[url('./alfred1.png')]  bg-no-repeat bg-contain bg-right-top sm:bg-none">
        {errorMessage && (
          <Alert className="mt-1" color={"failure"}>
            {errorMessage}
          </Alert>
        )}
        {/* Left */}
        <div className="flex-1 sm:pl-5">
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
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <div>
              <Label value="You username:" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

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
              <Label value="Your password:" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={(e) => setPass(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div>
              <Label value="Confirm password:" />
              <TextInput
                type="password"
                placeholder="Confirm password"
                id="confirm_password"
                onChange={(e) => setConfirmPass(e.target.value)}
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
                  <>Sign Up</>
                )}
              </Button>
            </div>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-3">
            <span>Have an account?</span>
            <Link to={"/login"} className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
