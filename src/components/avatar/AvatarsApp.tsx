import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import Sidekick from "./Sidekick";

export default function AvatarsApp() {
  const { client, volume } = useLiveAPIContext();

  return (
    <div className="avatars-app">
      <Sidekick volume={volume} isThinking={false} isActive={true} />
    </div>
  );
}
