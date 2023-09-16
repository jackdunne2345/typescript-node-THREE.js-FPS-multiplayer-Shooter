import FadeIn from "react-fade-in";
import { useState } from "react";
import ListGroup from "./ListGroup";
export default function JoinHost() {
  const [showListGroup, setShowListGroup] = useState(false);

  const handleButtonClick = () => {
    setShowListGroup(true);
  };
  return showListGroup ? (
    <ListGroup />
  ) : (
    <FadeIn>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          columnGap: "20px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button className="btn btn-info" onClick={handleButtonClick}>
          HOST
        </button>

        <button className="btn btn-info">JOIN</button>
      </div>
    </FadeIn>
  );
}
