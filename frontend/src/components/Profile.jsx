import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";

const Profile = () => {
  const { user } = useAuth();
  const filePickerRef = useRef();
  const [formData, setFormData] = useState({
    id: user.id || "",
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    pictureUrl: user.pictureUrl || "",
  });
  console.log(formData);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(
    user.pictureUrl || "/user.png"
  );
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

  const apiBaseUrl =
    "https://gestion-notes-backend.vercel.app" || "http://localhost:3001";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const userData = response.data;
        console.log("user data :", userData);
        setFormData((prevFormData) => ({
          ...prevFormData,
          id: userData.id || "",
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          pictureUrl: userData.pictureUrl || "",
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = async (e) => {
    console.log("handleImageChange function called");
    const file = e.target.files[0];
    console.log("Selected file:", file);

    if (file) {
      setImageFile(file);

      const formData = new FormData();
      formData.append("picture", file, file.name);
      console.log("Form Data:", formData);
      try {
        console.log("User ID:", user.id);
        console.log("Form Data:", formData);
        const requestUrl = `${apiBaseUrl}/api/users/${user.id}/picture`;
        console.log("Request URL:", requestUrl);

        const response = await axios.put(requestUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            console.log("Upload progress:", progress);
            setImageFileUploadProgress(progress);
          },
        });
        console.log("Image upload response:", response);
        setImageFileUrl(response.data.user.pictureUrl);
        setFormData((prevFormData) => ({
          ...prevFormData,
          pictureUrl: response.data.user.pictureUrl,
        }));
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const updateUserProfile = async () => {
    try {
      const response = await axios.put(`${apiBaseUrl}/api/users`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Profile updated:", response.data.message);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="w-full py-4 px-20 md:px-8 shadow-2xl flex flex-col items-center">
      <h1 className="my-4 text-center font-semibold text-3xl capitalize">
        Profile Details
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg flex flex-col gap-4 items-center"
      >
        <input
          type="file"
          accept="images/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 cursor-pointer shadow-md overflow-hidden rounded-full mb-8"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={
              formData.pictureUrl
                ? `${apiBaseUrl}/api/images/${formData.pictureUrl}`
                : "/user.png"
            }
            alt="user_picture"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>

        <div className="w-full flex flex-col md:flex-row gap-4">
          <input
            type="text"
            id="name"
            placeholder="Name"
            value={formData.name || ""}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 rounded-md shadow-md w-full md:w-auto"
          />
          <input
            type="email"
            id="email"
            placeholder="Email"
            readOnly
            value={formData.email || ""}
            className="border border-gray-300 px-3 py-2 rounded-md shadow-md w-full md:w-auto"
          />
        </div>

        <input
          type="text"
          id="phone"
          placeholder="Phone Number (Optional)"
          value={formData.phone || ""}
          onChange={handleChange}
          className="border border-gray-300 px-3 py-2 rounded-md shadow-md w-full"
        />

        <button
          type="submit"
          className="text-green-500 bg-white hover:bg-green-500 hover:text-white p-2 border border-green-500 rounded-md"
          disabled={imageFileUploading}
        >
          {imageFileUploading ? "Uploading..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
