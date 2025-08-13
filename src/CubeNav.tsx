import { Link } from "react-router";

export default function CubeNav() {
  return (
    <nav>
      <ul>
        <li>
          <strong>White Cube</strong>
        </li>
      </ul>
      <ul>
        <li>
          <Link to={"/"} className="contrast">
            Home
          </Link>
        </li>
        <li>
          <Link to={"/weaver"} className="contrast">
            Weaver
          </Link>
        </li>
        <li>
          <a
            href="https://github.com/astralfrontier/whitecube"
            className="contrast"
            target="_blank"
          >
            GitHub
          </a>
        </li>
      </ul>
    </nav>
  );
}
