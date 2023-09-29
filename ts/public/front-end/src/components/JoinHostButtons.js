import FadeIn from "react-fade-in";
import { useState } from "react";
import HostComponent from "./HostComponent";
export default function JoinHost() {
    const [showHostCompnent, setShowHostComponent] = useState(false);
    const [showJoinTextEntry, setShowJoinTextEntry] = useState(false);
    const buttonStyle = { width: "100%", margin: "3%" };
    const handleHostButtonClick = () => {
        setShowHostComponent(true);
        setShowJoinTextEntry(false);
    };
    const handleJoinButtonClick = () => {
        setShowJoinTextEntry(true);
        setShowHostComponent(false);
    };
    const divContainerStyle = {
        width: "33vw",
        height: "66vh",
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",
    };
    const divStyle = {
        width: "200px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
    };
    return (<>
      <FadeIn>
        <div style={divContainerStyle}>
          {!showHostCompnent && (<FadeIn>
              <div style={divStyle}>
                <button style={buttonStyle} className="btn btn-info" onClick={handleHostButtonClick}>
                  Host a match
                </button>
              </div>
            </FadeIn>)}
          {showHostCompnent && <HostComponent />}
          {!showJoinTextEntry && (<FadeIn>
              <div style={divStyle}>
                <button style={buttonStyle} className="btn btn-info" onClick={handleJoinButtonClick}>
                  Join a match
                </button>
              </div>
            </FadeIn>)}
          {showJoinTextEntry && (<FadeIn>
              <div style={divStyle}>
                <input style={{ textAlign: "center" }} placeholder="Enter Game join code" type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
                <FadeIn>
                  <button style={{ margin: "2%" }} className="btn btn-success">
                    Join
                  </button>
                </FadeIn>
              </div>
            </FadeIn>)}{" "}
          <FadeIn>
            <div style={divStyle}>
              <button style={buttonStyle} className="btn btn-info">
                Settings
              </button>
            </div>
          </FadeIn>
        </div>
      </FadeIn>
    </>);
}
