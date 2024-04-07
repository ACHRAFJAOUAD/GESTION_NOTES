import React from "react";
import Lottie from "lottie-react";
import not_found from "../animation/not_found.json";
function NotFound() {
  return (
    <div className="h-screen w-2/3 overflow-hidden mx-48 flex items-center justify-start">
      <Lottie animationData={not_found} />
    </div>
  );
}

export default NotFound;
