import { ChangeEvent, useEffect, useState } from "react";
import { Setting } from "../game/Types";
import Style from "../styles/Setting.module.scss";
import game from "../game/Game";
import { gState } from "../game/State";
type Prop = {
  Return: () => void;
};

export const Settings = (p: Prop) => {
  const [settings] = useState<Setting>(gState.SETTINGS);
  const [forward, setForward] = useState<string>(settings.control.forward);
  const [back, setBack] = useState<string>(settings.control.back);
  const [left, setLeft] = useState<string>(settings.control.left);
  const [right, setRight] = useState<string>(settings.control.right);
  const [fov, setFov] = useState<string>(settings.setting.fov.toString());
  const [sensitivity, setSensitivity] = useState<string>(
    settings.setting.sensitivty.toString()
  );
  const HandleKeyChange = (
    event: ChangeEvent<HTMLInputElement>,
    func: React.Dispatch<React.SetStateAction<string>>
  ) => {
    func(event.target.value.slice(-1).toLocaleLowerCase());
  };
  const HandleFovChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    const onlyNumbers = /^\d+(\.\d+)?$/;

    if (event.target.value === "" || onlyNumbers.test(inputValue)) {
      const int = parseInt(inputValue);
      if (int > 140) setFov("140");
      else if (int < 1) setFov("1");
      else setFov(inputValue);
    } else if (event.target.value === "" || inputValue === null) setFov("1");
  };
  const HandleSensitivtyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    const onlyNumbers = /^[0-9\b]+$/;

    if (event.target.value === "" || onlyNumbers.test(inputValue)) {
      if (parseInt(inputValue) > 100) {
        setSensitivity("100");
      } else setSensitivity(inputValue);
    }
  };

  return (
    <>
      <div className={Style.contain}>
        <div id={Style.setting}>
          <div className={Style.controls}>
            <p>Forwards: </p>
            <input
              value={forward}
              onChange={(event) => {
                HandleKeyChange(event, setForward);
              }}
            ></input>
          </div>

          <div className={Style.controls}>
            <p>Backwards: </p>
            <input
              value={back}
              onChange={(event) => {
                HandleKeyChange(event, setBack);
              }}
            ></input>
          </div>
          <div className={Style.controls}>
            <p>Left: </p>
            <input
              value={left}
              onChange={(event) => {
                HandleKeyChange(event, setLeft);
              }}
            ></input>
          </div>
          <div className={Style.controls}>
            <p>Right: </p>
            <input
              value={right}
              onChange={(event) => {
                HandleKeyChange(event, setRight);
              }}
            ></input>
          </div>
          <div className={Style.setting}>
            <p>FOV: </p>
            <input
              value={fov}
              onChange={(event) => {
                HandleFovChange(event);
              }}
            ></input>
          </div>
          <div className={Style.setting}>
            <div>
              <p>Sensitivity: </p>
            </div>
            <div className={Style.slideContainer}>
              <input
                className={Style.slider}
                type="range"
                min="0"
                max="100"
                value={sensitivity}
                onChange={(event) => {
                  HandleSensitivtyChange(event);
                }}
              />
              <input
                className={Style.inputBox}
                value={sensitivity}
                onChange={(event) => {
                  HandleSensitivtyChange(event);
                }}
              ></input>
            </div>
          </div>

          <button
            onClick={() => {
              if (parseInt(sensitivity) === 0) {
                setSensitivity("0.01");
              }
              const newSettings: Setting = {
                control: {
                  forward: forward,
                  back: back,
                  left: left,
                  right: right,
                },
                setting: {
                  fov: parseInt(fov),
                  sensitivty: parseInt(sensitivity),
                },
              };
              gState.SETTINGS = newSettings;
            }}
          >
            Apply
          </button>
          <button
            onClick={() => {
              p.Return();
            }}
          >
            Back
          </button>
        </div>
      </div>
    </>
  );
};
