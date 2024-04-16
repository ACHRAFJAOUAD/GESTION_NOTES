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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/users", {
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
    console.log("Selected file:", file); // Log the selected file

    if (file) {
      setImageFile(file);

      // Create a new FormData object
      const formData = new FormData();
      // Append the file to the FormData object with the key 'picture'
      formData.append("picture", file, file.name);
      console.log("Form Data:", formData);
      try {
        console.log("User ID:", user.id);
        console.log("Form Data:", formData); // Make sure formData is populated
        const requestUrl = `http://localhost:3001/api/users/${user.id}/picture`;
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
            console.log("Upload progress:", progress); // Log the upload progress
            setImageFileUploadProgress(progress);
          },
        });
        console.log("Image upload response:", response);
        setImageFileUrl(response.data.user.pictureUrl); // Update the image file URL
        setFormData((prevFormData) => ({
          ...prevFormData,
          pictureUrl: response.data.user.pictureUrl, // Update the pictureUrl in formData
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
      const response = await axios.put(
        "http://localhost:3001/api/users",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Profile updated:", response.data.message);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="w-full py-16 px-8 shadow-2xl flex justify-center flex-col items-center">
      <h1 className="my-4 text-center font-semibold text-3xl capitalize">
        Profile Details
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="images/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full mb-8"
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
                ? `http://localhost:3001/images/${formData.pictureUrl}`
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

        <div className="flex gap-4">
          <input
            type="text"
            id="name"
            placeholder="Name"
            value={formData.name || ""}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 rounded-md shadow-md"
          />
          <input
            type="email"
            id="email"
            placeholder="Email"
            readOnly
            value={formData.email || ""}
            className="border border-gray-300 px-3 py-2 rounded-md shadow-md"
          />
        </div>

        <input
          type="text"
          id="phone"
          placeholder="Phone Number (Optional)"
          value={formData.phone || ""}
          onChange={handleChange}
          className="border border-gray-300 px-3 py-2 rounded-md shadow-md"
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
