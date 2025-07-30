import { Routes, Route } from "react-router";
import "./App.sass";
import CubeNav from "./CubeNav";
import CubeHome from "./CubeHome";

function App() {
  return (
    <>
      <main className="container">
        <CubeNav />
        <Routes>
          <Route path="/" element={<CubeHome />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
