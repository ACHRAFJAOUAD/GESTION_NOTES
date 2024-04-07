import React from "react";
import Lottie from "lottie-react";
import loadData from "../animation/loader.json";
function PreloadScene() {
  return (
    <div className=" drop-shadow-xl">
      <Lottie animationData={loadData} />
    </div>
  );
}

export default PreloadScene;
