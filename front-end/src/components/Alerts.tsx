import { useEffect, useState } from "react";
import Style from "../styles/Alert.module.scss";
import { ServerError } from "../game/Types";
type Props = {
  Alerts: ServerError[];
  setAlerts: React.Dispatch<React.SetStateAction<ServerError[]>>;
};

export const Alert = (p: Props) => {
  const [alert, setAlert] = useState<ServerError>();
  useEffect(() => {
    if (p.Alerts.length > 0) {
      setAlert(p.Alerts[p.Alerts.length - 1]);
    }
  }, [p.Alerts]);

  return (
    <>
      <div className={Style.alert}>
        <div>
          {alert?.error}
          <button
            onClick={() => {
              if (p.Alerts.length > 0) {
                setAlert(p.Alerts[p.Alerts.length - 1]);
                p.setAlerts(p.Alerts.slice(0, p.Alerts.length - 2));
              }
            }}
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
};

export const Error = () => {};

export const ChangeControls = () => {};
