import { Alert, Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import api from "../api";
import {
  updateFailure,
  updateStart,
  updateSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutSuccess,
} from "../redux/slices/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

const DashProfile = () => {
  const dispatch = useDispatch();
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const refUpdate = useRef();
  const api_url = `${api}/users/update/${currentUser._id}`;
  const delete_api = `${api}/users/delete/${currentUser._id}/${currentUser._id}`;
  const signOut_api = `${api}/users/logout`;
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    /* 
          rules_version = '2';

      // Craft rules based on data in your Firestore database
      // allow write: if firestore.get(
      //    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
      service firebase.storage {
        match /b/{bucket}/o {
          match /{allPaths=**} {
            allow read; 
            allow write: if 
            request.resource.size < 2*1024*1024 && 
            request.resource.contentType.matches("image/.*")
          }
        }
      } 
          */
    setImageFileUploadError(null);
    setImageUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;

    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("Error: File must be 2mb or below");
        setImageFileUploadingProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePhoto: downloadURL });
          setImageUploading(false);
        });
      }
    );
  };

  setTimeout(() => {
    setImageFileUploadingProgress(null);
    setUpdateUserSuccess(null);
  }, 7000);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateStart());
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      dispatch(updateFailure("No changes made"));
      return;
    }
    if (imageUploading) {
      dispatch(updateFailure("Please wait..."));
      return;
    }
    try {
      const res = await fetch(api_url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + currentUser.accessToken,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess(
          `${currentUser.username}'s profile updated successfully`
        );
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(delete_api, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + currentUser.accessToken,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

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
    <div className=" max-w-lg mx-auto p-3 w-full">
      <h1 className="font-semibold text-2xl mt-2 text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          name="image"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          ref={refUpdate}
          className={"hidden"}
        />
        <div
          className="w-32 relative h-32 rounded-full self-center mt-2 cursor-pointer shadow-md overflow-hidden"
          onClick={() => refUpdate.current.click()}
        >
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={imageFileUploadingProgress || 0}
              text={`${imageFileUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "8rem",
                  height: "8rem",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadingProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePhoto}
            alt={currentUser.username}
            className={`w-full h-full rounded-full object-cover border-8 border-[lightgrey] ${
              imageFileUploadingProgress &&
              imageFileUploadingProgress < 100 &&
              `opacity-60`
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color={"failure"}>{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />

        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone={"purpleToBlue"}
          outline
          disabled={loading || imageUploading}
        >
          <p className="text-lg">{loading ? "Loading..." : "Update Profile"}</p>
        </Button>
        {currentUser.isAdmin && (
          <>
            <Link to={"/create-post"}>
              <Button
                type="button"
                gradientDuoTone={"purpleToPink"}
                className="w-full"
              >
                <p className="text-lg">Create a post</p>
              </Button>
            </Link>
            <Link to={"/create-project"}>
              <Button
                type="button"
                gradientDuoTone={"purpleToPink"}
                className="w-full"
              >
                <p className="text-lg">Create project</p>
              </Button>
            </Link>
            <Link to={"/create-slide"}>
              <Button
                type="button"
                gradientDuoTone={"purpleToPink"}
                className="w-full"
              >
                <p className="text-lg">Create slide</p>
              </Button>
            </Link>
          </>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-3">
        <span className=" cursor-pointer" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className=" cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>

      {updateUserSuccess && (
        <Alert color={"success"} className="mt-2">
          {updateUserSuccess}
        </Alert>
      )}
      {error && (
        <Alert color={"failure"} className="mt-2">
          {error}
        </Alert>
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
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color={"failure"} onClick={handleDeleteUser}>
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

export default DashProfile;
