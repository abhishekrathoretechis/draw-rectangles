import React, { useState, useRef } from "react";
import { Stage, Layer, Rect } from "react-konva";

const DrawAnnotations = ({ drawingEnabled, annotations, setAnnotations }) => {
  const [newAnnotation, setNewAnnotation] = useState(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [resizingCorner, setResizingCorner] = useState(null);
  const stageRef = useRef(null);

  const handleMouseDown = (event) => {
    if (!drawingEnabled) return;

    const { x, y } = event.target.getStage().getPointerPosition();

    if (!selectedAnnotation) {
      setNewAnnotation({ x, y, width: 0, height: 0, key: Date.now() });
    } else {
      const corner = getResizingCorner(selectedAnnotation, x, y);
      if (corner) {
        setResizingCorner(corner);
      }
    }
  };

  const handleMouseMove = (event) => {
    if (!drawingEnabled || (!newAnnotation && !resizingCorner)) return;

    const { x, y } = stageRef.current.getPointerPosition();

    if (resizingCorner && selectedAnnotation) {
      const updatedAnnotation = calculateResizedDimensions(
        selectedAnnotation,
        x,
        y
      );

      setAnnotations((prevAnnotations) =>
        prevAnnotations.map((annotation) =>
          annotation === selectedAnnotation ? updatedAnnotation : annotation
        )
      );
      setSelectedAnnotation(updatedAnnotation);
    } else if (newAnnotation) {
      setNewAnnotation((prevAnnotation) => ({
        ...prevAnnotation,
        width: x - prevAnnotation.x,
        height: y - prevAnnotation.y,
      }));
    }
  };

  const handleMouseUp = () => {
    if (!drawingEnabled) return;

    if (newAnnotation && newAnnotation.width > 0 && newAnnotation.height > 0) {
      setAnnotations([...annotations, newAnnotation]);
    }

    setNewAnnotation(null);
    setResizingCorner(null);
  };

  const getResizingCorner = (annotation, x, y) => {
    const tolerance = 8;

    if (
      Math.abs(x - (annotation.x + annotation.width)) <= tolerance &&
      Math.abs(y - (annotation.y + annotation.height)) <= tolerance
    ) {
      return "bottomRight";
    }

    return null;
  };

  const calculateResizedDimensions = (annotation, x, y) => {
    const updatedAnnotation = { ...annotation };

    switch (resizingCorner) {
      case "bottomRight":
        updatedAnnotation.width = x - annotation.x;
        updatedAnnotation.height = y - annotation.y;
        break;
      default:
        break;
    }

    return updatedAnnotation;
  };

  const cursorStyle = (selectedAnnotation, resizingCorner) => {
    if (resizingCorner) {
      switch (resizingCorner) {
        case "bottomRight":
          return "nwse-resize";
        default:
          return "default";
      }
    } else if (selectedAnnotation) {
      return "move";
    } else {
      return "crosshair";
    }
  };

  return (
    <Stage
      ref={stageRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      width={900}
      height={700}
      style={{ cursor: cursorStyle(selectedAnnotation, resizingCorner) }}
    >
      <Layer>
        {annotations.map((annotation) => (
          <Rect
            key={annotation.key}
            x={annotation.x}
            y={annotation.y}
            width={annotation.width}
            height={annotation.height}
            fill="transparent"
            stroke={selectedAnnotation === annotation ? "red" : "black"}
            onClick={() => setSelectedAnnotation(annotation)}
            draggable
            onDragEnd={(e) => {
              const updatedAnnotations = annotations.map((anno) =>
                anno === selectedAnnotation
                  ? {
                      ...anno,
                      x: e.target.x(),
                      y: e.target.y(),
                    }
                  : anno
              );
              setAnnotations(updatedAnnotations);
              setSelectedAnnotation(null);
            }}
          />
        ))}
        {newAnnotation && (
          <Rect
            x={newAnnotation.x}
            y={newAnnotation.y}
            width={newAnnotation.width}
            height={newAnnotation.height}
            fill="transparent"
            stroke="black"
          />
        )}
      </Layer>
    </Stage>
  );
};

export default DrawAnnotations;
