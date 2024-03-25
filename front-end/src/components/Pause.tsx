import Styles from "../styles/Pause_style.module.scss";
interface Props {
  back: () => void;
}
export const Pause: React.FC<Props> = ({ back }) => {
  return (
    <div className={Styles.pauseDiv}>
      <button
        onClick={() => {
          back();
        }}
      >
        Resume
      </button>
      <button>Settings</button>
      <button>Leave game</button>
    </div>
  );
};
