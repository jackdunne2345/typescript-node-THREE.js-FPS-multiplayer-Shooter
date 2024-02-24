import "bootstrap/dist/css/bootstrap.css";

interface Props {
  back: () => void;
}

const Host: React.FC<Props> = ({ back }) => {
  return (
    <div>
      <button onClick={back}>Back</button>
      <p>Join Code:</p>
      <p>Players</p>
      <ul className="list-group">
        <li className="list-group-item">hi</li>
      </ul>
      <button>Start Game</button>
    </div>
  );
};
export default Host;
