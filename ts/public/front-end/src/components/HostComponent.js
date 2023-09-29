import FadeIn from "react-fade-in";
export default function HostComponent() {
    let items = [];
    return (<FadeIn>
      <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
        }}>
        <h1>Players</h1>
        {items.length === 0 && <p>No one here :(</p>}
        <ul className="list-group">
          {items.map((item) => (
        //EVERYTHING NEEDS A UNIQUE KEY
        <li key={item} className="list-group-item">
              {item}
            </li>))}
        </ul>
        <button className="btn btn-success">Generate</button>
        <p></p>
      </div>
    </FadeIn>);
}
