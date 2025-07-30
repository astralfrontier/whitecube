import CubeRefRangeArea from "./CubeRefRangeArea";
import CubeRefSooth from "./CubeRefSooth";

export default function CubeHome() {
  return (
    <>
      <div className="grid">
        <div>
          <CubeRefSooth />
        </div>
        <div>
          <CubeRefRangeArea />
        </div>
      </div>
    </>
  );
}
