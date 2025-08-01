import CubeDepletionTracker from "./CubeDepletionTracker";
import CubeRefDistanceArea from "./CubeRefDistanceArea";
import CubeRefSooth from "./CubeRefSooth";

export default function CubeHome() {
  return (
    <>
      <div className="grid">
        <div>
          <CubeRefSooth />
        </div>
        <div>
          <CubeRefDistanceArea />
        </div>
      </div>
      <div>
        <CubeDepletionTracker />
      </div>
    </>
  );
}
