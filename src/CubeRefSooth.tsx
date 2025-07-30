import SoothMysteries from "./assets/sooth-mysteries.svg";
import SoothNotions from "./assets/sooth-notions.svg";
import SoothSecrets from "./assets/sooth-secrets.svg";
import SoothVisions from "./assets/sooth-visions.svg";

import styles from "./CubeRefSooth.module.sass";

interface SoothIconProps {
  icon: string;
  description: string;
}

function SoothIcon(props: SoothIconProps) {
  const { icon, description } = props;
  return <img className={styles.sooth} src={icon} alt={description} />;
}

export default function CubeRefSooth() {
  return (
    <>
      <h1>Sooth Symbols</h1>
      <table>
        <thead>
          <tr>
            <th scope="col">Symbol</th>
            <th scope="col">Name</th>
            <th scope="col">Heart</th>
            <th scope="col">Associations</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              <SoothIcon icon={SoothMysteries} description="Mysteries" />
            </th>
            <td>Mysteries</td>
            <td>Stoic</td>
            <td>Rats - Mirrors - Stone</td>
          </tr>
          <tr>
            <th scope="row">
              <SoothIcon icon={SoothNotions} description="Notions" />
            </th>
            <td>Notions</td>
            <td>Ardent</td>
            <td>Cats - Clocks - Wind</td>
          </tr>
          <tr>
            <th scope="row">
              <SoothIcon icon={SoothSecrets} description="Secrets" />
            </th>
            <td>Secrets</td>
            <td>Galant</td>
            <td>Ravens - Books - Flame</td>
          </tr>
          <tr>
            <th scope="row">
              <SoothIcon icon={SoothVisions} description="Visions" />
            </th>
            <td>Visions</td>
            <td>Empath</td>
            <td>Swans - Blades - Water</td>
          </tr>
        </tbody>
      </table>
      <p>
        <em>Rules reference: "The Gate" p. 72</em>
      </p>
    </>
  );
}
