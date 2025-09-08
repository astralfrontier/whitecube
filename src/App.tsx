import { Routes, Route } from "react-router";
import "./App.sass";
import CubeNav from "./CubeNav";
import CubeHome from "./CubeHome";
import WeaverHome from "./WeaverHome";
import MakerHome from "./MakerHome";

function App() {
  return (
    <>
      <main className="container">
        <CubeNav />
        <Routes>
          <Route path="/" element={<CubeHome />} />
          <Route path="/maker" element={<MakerHome />} />
          <Route path="/weaver" element={<WeaverHome />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
