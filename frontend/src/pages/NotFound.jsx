import React from "react";
import Lottie from "lottie-react";
import not_found from "../animation/not_found.json";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg mx-auto">
        <Lottie animationData={not_found} />
      </div>
    </div>
  );
}

export default NotFound;
