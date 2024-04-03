import React, { useEffect, useState } from "react";
import { Setting } from "../game/Types";
type Prop = {
  Return: () => void;
};
type ChangeKeyProp = {
  Key: string;
};

export const Settings = (p: Prop) => {
  const [settings, setSettings] = useState<Setting>();
  const [newSettings, setNewSettings] = useState<Setting>();
  useEffect(() => {
    const jsonStr = localStorage.getItem("userSettings");

    if (jsonStr) {
      console.log("Data retrieved from local storage:", jsonStr);

      try {
        const s: Setting = JSON.parse(jsonStr);

        setSettings(s);
        setNewSettings(s);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.log("");
    }
    console.log("Parsed data:", settings);
  }, []);

  return (
    <div>
      <div>
        <p>Forwards: </p>
        <button onClick={() => {}}>{settings?.control.forward}</button>
      </div>

      <div>
        <p>Backwards: </p>
      </div>
      <div>
        <p>Left: </p>
      </div>
      <div>
        <p>Right: </p>
      </div>
      <button>Apply</button>
      <button
        onClick={() => {
          p.Return();
        }}
      >
        Back
      </button>
    </div>
  );
};
const ChangeKey = (p: ChangeKeyProp) => {
  const [key, setKey] = useState<string>(p.Key);
  useEffect(() => {
    document.addEventListener("keydown", (event): void => {
      setKey(event.key);
    });
  }, []);

  return (
    <div>
      <p>press the key you want to be</p>
      <p>{key}</p>
    </div>
  );
};
