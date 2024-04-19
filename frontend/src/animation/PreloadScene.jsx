import React from "react";
import Lottie from "lottie-react";
import loadData from "../animation/loader.json";
function PreloadScene() {
  return (
    <div className=" w-full h-full  flex justify-center items-center mx-auto">
      <Lottie animationData={loadData} />
    </div>
  );
}

export default PreloadScene;
