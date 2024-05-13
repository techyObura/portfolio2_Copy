import React, { useState } from "react";
import { Alert, Button, FileInput, TextInput, Textarea } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateProject = ({ menu }) => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const create_project_api = `${api}/projects/create/${currentUser._id}`;
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [checked, setChecked] = useState(false);

  const handleUploadImage = async (e) => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
      }

      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;

      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError(error.message);
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(create_project_api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + currentUser.accessToken,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setPublishError(data.message);
      }

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate("/projects");
      }
    } catch (error) {
      setPublishError(error.message);
    }
  };

  setTimeout(() => {
    setPublishError(null);
  }, 5000);

  return (
    <div
      className={`min-h-[100vh] p-3 relative  ${
        menu ? "top-[46vw] md:top-32 lg:top-20" : "top-20 md:top-32 lg:top-20"
      } `}
    >
      <div></div> {/* Create Background Image */}
      <div></div> {/* Create Slider */}
      <div>
        <h1 className="text-center text-2xl sm:text-3xl my-7 font-semibold">
          Create a project
        </h1>
        <form onSubmit={handleSubmit}>
          {publishError && (
            <Alert color={"failure"} className="my-2">
              {publishError}
            </Alert>
          )}
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              placeholder="Title"
              required
              id="title"
              type="text"
              className="flex-1"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value || false })
              }
            />
            <TextInput
              placeholder="url"
              required
              id="url"
              type="text"
              className="w-full sm:w-[30%] mb-3"
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
            />

            <div className="flex h-10 justify-between sm:justify-right items-center gap-4 border border-teal-500 px-3 ">
              <label htmlFor="complete"> completed? </label>
              <input
                id="complete"
                type="checkbox"
                className="w-8 rounded-md h-6 self-center"
                onChange={(e) =>
                  setFormData({ ...formData, isComplete: e.target.checked })
                }
              />
            </div>
          </div>
          <div className="flex gap-4 items-center justify-center border-4 border-teal-500 border-dotted p-3 mt-2">
            <FileInput
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Button
              type="button"
              gradientDuoTone={"purpleToBlue"}
              outline
              size={"sm"}
              onClick={handleUploadImage}
            >
              {imageUploadProgress ? (
                <div className="w-16 h16">
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0}%`}
                  />
                </div>
              ) : (
                <div> Upload image</div>
              )}
            </Button>
          </div>
          {imageUploadError && (
            <Alert color={"failure"}>{imageUploadError}</Alert>
          )}

          {formData.image && (
            <img
              src={formData.image}
              alt="upload"
              className="w-full h-72 object-cover object-top"
            />
          )}
          <Textarea
            type="text"
            placeholder="Write something..."
            className="h-72 mt-2 mb-12"
            required
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <Button
            type="submit"
            gradientDuoTone={"purpleToPink"}
            className="w-full"
          >
            Publish
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
