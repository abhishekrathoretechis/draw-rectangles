import React, { useState, useEffect } from "react";
import "./App.css";
import DrawAnnotations from "./DrawAnnotations";

const App = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drawingEnabled, setDrawingEnabled] = useState(false);
  const [annotations, setAnnotations] = useState([]);

  const handleKeyDown = (event) => {
    if (event.key === "n" || event.key === "N" || event.code === "KeyN ") {
      goToNext();
    } else if (event.key === "p" || event.key === "P" || event.code === "KeyP") {
      goToPrevious();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleDrawing = () => {
    setDrawingEnabled(!drawingEnabled);
  };

  const clearAnnotations = () => {
    setAnnotations([]);
   
  };
  const handleImageUpload = (event) => {
    const newImages = [...uploadedImages];
    for (let i = 0; i < event.target.files.length; i++) {
      newImages.push(URL.createObjectURL(event.target.files[i]));
    }
    setUploadedImages(newImages);
    setCurrentIndex(newImages.length - 1); // Set currentIndex to the index of the last image
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, uploadedImages.length - 1)
    );
  };

  const deleteCurrentImage = () => {
    const newImages = [...uploadedImages];
    newImages.splice(currentIndex, 1);
    setUploadedImages(newImages);
    if (currentIndex >= newImages.length) {
      setCurrentIndex(newImages.length - 1);
    }
  };

  return (
    <div className="app">
      <div className="navbar">
        <input type="file" multiple onChange={handleImageUpload} />
        <button onClick={goToPrevious} disabled={currentIndex === 0}>
          Previous
        </button>
        <button
          onClick={goToNext}
          disabled={currentIndex === uploadedImages.length - 1}
        >
          Next
        </button>
        <button onClick={deleteCurrentImage}>Delete Current Image</button>
        <button onClick={toggleDrawing}>
          {drawingEnabled ? "Disable Drawing" : "Enable Drawing"}
        </button>
        <button onClick={clearAnnotations}>Delete All Rectangles</button>
      </div>
      <div className="imagecontainer">
        {uploadedImages.length > 0 && (
          <div>
            <img
              src={uploadedImages[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              className="image-viewer"
            />
          </div>
        )}
      </div>
      <div className="rectangles">
        <DrawAnnotations
          drawingEnabled={drawingEnabled}
          annotations={annotations}
          setAnnotations={setAnnotations}
        />
      </div>
    </div>
  );
};

export default App;
