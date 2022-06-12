import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, facesFrames }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img
          id="inputImage"
          alt=""
          src={imageUrl}
          width="500px"
          height="auto"
        />
        {facesFrames.map((frame) => (
          <div
            className="bounding-box"
            style={{
              left: frame.leftCol,
              top: frame.topRow,
              right: frame.rightCol,
              bottom: frame.bottomRow,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FaceRecognition;
