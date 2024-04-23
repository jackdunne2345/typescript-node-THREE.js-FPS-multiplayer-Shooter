import { useEffect, useState } from "react";
import Style from "../styles/Alert.module.scss";
type Props = {
  Component: JSX.Element[];
};

export const Alert = (p: Props) => {
  const [component, setComponent] = useState<JSX.Element | undefined>();
  useEffect(() => {
    setComponent(p.Component.pop());
  }, []);

  return (
    <>
      {component && (
        <div className={Style.alert}>
          <div>
            {component}
            <button
              onClick={() => {
                setComponent(p.Component.pop());
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
