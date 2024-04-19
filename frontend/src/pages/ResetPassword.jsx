import React, { useRef, useState } from "react";
import Lottie from "lottie-react";
import ResetPasswordData from "../animation/reset_password.json";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResetPassword() {
  const form = useRef();
  const nav = useNavigate();

  const [errors, setErrors] = useState({
    user_name: "",
    user_email: "",
    reset_password: "",
  });
  const [isValid, setIsValid] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const handleBackClick = () => {
    window.location.href = "/login";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValid) return;

    setIsSending(true);

    emailjs
      .sendForm("service_lczb7fb", "template_dcpx7rt", form.current, {
        publicKey: "0pBfUHdZyOEK2Ev9y",
      })
      .then(
        (result) => {
          console.log(result.text);
          console.log("SUCCESS!");
          toast.success(
            "Your message has been sent successfully! wait for our response."
          );
        },
        (error) => {
          console.log("FAILED...", error.text);
          setIsSending(false);
          toast.error("Failed to send message. Please try again.");
        }
      );
  };

  const validateForm = () => {
    const nameInput = form.current["user_name"];
    const emailInput = form.current["user_email"];
    const errorMessageInput = form.current["reset_password"];

    const errorsCopy = { ...errors };

    errorsCopy.user_name = nameInput.value.trim()
      ? ""
      : "Please enter your full name";
    errorsCopy.user_email = /\S+@\S+\.\S+/.test(emailInput.value)
      ? ""
      : "Please enter a valid email address";
    errorsCopy.reset_password = errorMessageInput.value.trim()
      ? ""
      : "Please write the error you're facing";

    setErrors(errorsCopy);

    setIsValid(
      !errorsCopy.user_name &&
        !errorsCopy.user_email &&
        !errorsCopy.reset_password
    );
  };

  const handleToastClose = () => {
    nav("/login");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-md md:p-12 flex flex-col md:flex-row md:space-x-6">
        <div className="w-full md:w-1/2 bg-green-500 text-white rounded-md p-6 flex flex-col items-center justify-center">
          <div className="mb-3 md:w-auto">
            <Lottie animationData={ResetPasswordData} />
          </div>
          <p className="text-center text-3xl font-semibold">
            Reset your password
          </p>
        </div>
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="mb-6 flex flex-col justify-center items-center">
            <h2 className="text-3xl font-semibold mb-2 text-center">Welcome</h2>
            <p className="text-center">
              We are happy to bring your Password back
            </p>
          </div>
          <form ref={form} onSubmit={handleSubmit}>
            <div className="mb-4 mx-4">
              <input
                name="user_name"
                type="text"
                id="name"
                className={`bg-gray-100 w-full py-3 px-4 rounded-lg mb-3 ${
                  errors.user_name ? "border-red-500" : ""
                }`}
                placeholder=" Your full name here"
                required
                onBlur={validateForm}
              />
              {errors.user_name && (
                <p className="text-red-500 text-sm">{errors.user_name}</p>
              )}
              <input
                name="user_email"
                type="email"
                id="email"
                className={`bg-gray-100 w-full py-3 px-4 rounded-lg mb-3 ${
                  errors.user_email ? "border-red-500" : ""
                }`}
                placeholder=" Your Email address"
                required
                onBlur={validateForm}
              />
              {errors.user_email && (
                <p className="text-red-500 text-sm">{errors.user_email}</p>
              )}
              <input
                name="subject"
                type="text"
                id="subject"
                value={"Reset Password"}
                className="bg-gray-100 w-full py-3 px-4 rounded-lg mb-3"
                readOnly
              />
              <textarea
                placeholder="Write the Error You're Facing ..."
                id="errorMessage"
                name="reset_password"
                className={`bg-gray-100 w-full py-3 px-4 rounded-lg mb-3 ${
                  errors.reset_password ? "border-red-500" : ""
                }`}
                rows="4"
                required
                onBlur={validateForm}
              ></textarea>
              {errors.reset_password && (
                <p className="text-red-500 text-sm">{errors.reset_password}</p>
              )}
            </div>
            <div className="mx-4">
              <button
                type="submit"
                className="mb-4 bg-blue-500 text-white hover:text-blue-500 hover:bg-white border-blue-500 py-3 border rounded-lg w-full"
                disabled={!isValid || isSending}
              >
                Send
              </button>
              <ToastContainer onClose={handleToastClose} />
              <button
                onClick={handleBackClick}
                className=" mb-4 bg-gray-400 text-white hover:text-gray-400 hover:bg-white border-gray-500 py-3 border rounded-lg w-full"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
