import { useState } from "react";
import Style from "../styles/Login.module.scss";
type Props = {
  back: (value: React.SetStateAction<string>) => void;
};
export const Login = (p: Props) => {
  const [loginOrSignup, setLoginOrSignup] = useState<boolean>(true);
  return (
    <div className={Style.login}>
      <div id={Style.options}>
        <button
          onClick={() => {
            setLoginOrSignup(true);
          }}
        >
          login
        </button>
        <button
          onClick={() => {
            setLoginOrSignup(false);
          }}
        >
          sign up
        </button>
      </div>
      <div className={Style.form}>
        <div className={Style.head}>
          <p>
            {loginOrSignup === true && "login"}
            {loginOrSignup === false && "sign up"}
          </p>
        </div>
        <div className={Style.middle}>
          <input className="searchInput" placeholder="User name"></input>

          <input className="searchInput" placeholder="Password"></input>
          {!loginOrSignup && (
            <input
              className="searchInput"
              placeholder="Re-enter password"
            ></input>
          )}

          {!loginOrSignup && (
            <input className="searchInput" placeholder="Email"></input>
          )}
        </div>
        <div className={Style.bottom}>
          <button
            onClick={() => {
              p.back("home");
            }}
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
};
