import { useEffect, useState } from "react";
import Style from "../styles/Alert.module.scss";
import { ServerError } from "../game/Types";
type Props = {
  Alerts: ServerError[];
};

export const Alert = (p: Props) => {
  const [alert, setAlert] = useState<{ error: string } | undefined>();
  useEffect(() => {
    setAlert(p.Alerts.pop());
  }, []);

  return (
    <>
      {alert && (
        <div className={Style.alert}>
          <div>
            {alert.error}
            <button
              onClick={() => {
                setAlert(p.Alerts.pop());
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const Error = () => {};

export const ChangeControls = () => {};
