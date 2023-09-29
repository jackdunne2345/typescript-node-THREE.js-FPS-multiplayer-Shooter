import JoinHost from "./components/JoinHostButtons";
export default function App() {
    return (<div style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            columnGap: "20px",
            justifyContent: "center",
            alignItems: "center",
        }}>
      <JoinHost />
    </div>);
}
