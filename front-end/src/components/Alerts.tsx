import Style from "../styles/Alert.module.scss";
type Props = {
  Component: () => JSX.Element;
};

export const alertStack: Props[] = [];

export const Alert = (p: Props) => {
  return (
    <>
      <div>
        <p.Component></p.Component>
      </div>
      <button>OK</button>
    </>
  );
};
