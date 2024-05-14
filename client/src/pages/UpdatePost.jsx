import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FileInput,
  Select,
  TextInput,
  Textarea,
} from "flowbite-react";
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
import { useNavigate, useParams } from "react-router-dom";

const UpdatePost = ({ menu }) => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const getPostApi = `${api}/posts/posts?postId=${postId}`;
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const update_post_api = `${api}/posts/update/${formData._id}/${currentUser._id}`;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(getPostApi);
        const data = await res.json();

        if (res.ok) {
          setFormData(data.posts[0]);
          setPublishError(null);
        }
        if (!res.ok) {
          setPublishError(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPost();
    }
  }, [postId]);

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
      const res = await fetch(update_post_api, {
        method: "PUT",
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
        navigate(`/posts/${data.slug}`);
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
      className={` min-h-screen p-3 max-w-3xl mx-auto relative ${
        menu ? "top-[42vw] sm:top-16" : "top-16"
      }`}
    >
      <h1 className="text-center text-2xl sm:text-3xl my-7 font-semibold">
        {" "}
        Update post
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
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="html">Life</option>
            <option value="css">programming</option>
            <option value="javascript">Hobby</option>
            <option value="reactjs">Event</option>
            <option value="nextjs">Experience</option>
            <option value="expressjs">Education</option>
            <option value="nodejs">Engineering</option>
            <option value="brainjs">Technology</option>
          </Select>
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
            className="w-full h-72 sm:h-[50vh] object-cover object-top"
          />
        )}
        <Textarea
          placeholder="Write something..."
          className="h-72 mt-2 mb-12"
          required
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        />

        <Button
          type="submit"
          gradientDuoTone={"purpleToPink"}
          className="w-full"
        >
          Update post
        </Button>
      </form>
    </div>
  );
};

export default UpdatePost;
