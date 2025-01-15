import {
  ChangeEvent,
  FormEvent,
  FormEventHandler,
  useCallback,
  useMemo,
  useState,
} from "react";
import "./settings-dialog.scss";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { LiveConfig } from "../../multimodal-live-types";
import { Select } from "@react-three/drei";

export default function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const { config, setConfig } = useLiveAPIContext();
  // const [systemInstruction, setSystemInstruction] = useState(
  //   config.systemInstruction?.parts.find((p) => p.text)?.text || "",
  // );
  const systemInstruction = useMemo(() => {
    const s = config.systemInstruction?.parts.find((p) => p.text)?.text || "";
    console.log(s);
    return s;
  }, [config]);

  const updateConfig: FormEventHandler<HTMLTextAreaElement> = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const newConfig: LiveConfig = {
        ...{ model: config.model },
        systemInstruction: {
          parts: [{ text: event.target.value }],
        },
      };
      //setSystemInstruction(event.target.value);
      setConfig(newConfig);
    },
    [config, setConfig],
  );

  return (
    <div className="settings-dialog">
      <button
        className="action-button material-symbols-outlined"
        onClick={() => setOpen(!open)}
      >
        settings
      </button>
      <dialog className="dialog" style={{ display: open ? "block" : "none" }}>
        <h3>Settings</h3>
        <p>
          These settings can only be applied before connecting. Settings here
          will override other settings.
        </p>
        <textarea onChange={updateConfig} value={systemInstruction} />
      </dialog>
    </div>
  );
}
