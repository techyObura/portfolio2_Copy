import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import app from "../firebase";
import api from "../api";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../redux/slices/userSlice";

const OAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth(app);
  const api_url = `${api}/auth/google`;
  const handleGoogleClick = async () => {
    /* Create a provider */
    const provider = new GoogleAuthProvider();
    //set custom parameters
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      dispatch(signInStart());
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch(api_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          profilePhoto: resultFromGoogle.user.photoURL,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <Button
      className="w-full mt-3 flex justify-center items-center"
      type="button"
      gradientDuoTone={"pinkToOrange"}
      outline
      onClick={handleGoogleClick}
    >
      <span className="flex justify-center items-center text-md">
        <AiFillGoogleCircle size={25} className="mr-1" /> Continue with Google
      </span>
    </Button>
  );
};

export default OAuth;
