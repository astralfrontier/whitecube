import SoothMysteries from "./assets/sooth-mysteries.svg";
import SoothNotions from "./assets/sooth-notions.svg";
import SoothSecrets from "./assets/sooth-secrets.svg";
import SoothVisions from "./assets/sooth-visions.svg";

import styles from "./CubeRefSooth.module.sass";

const SOOTH_DATA = [
  {
    name: "Mysteries",
    icon: SoothMysteries,
    heart: "Stoic",
    heartAliases: "aka Stoneheart",
    associations: "Rats - Mirrors - Stone",
  },
  {
    name: "Notions",
    icon: SoothNotions,
    heart: "Ardent",
    heartAliases: "aka Stormheart",
    associations: "Cats - Clocks - Wind",
  },
  {
    name: "Secrets",
    icon: SoothSecrets,
    heart: "Galant",
    heartAliases: "aka Flameheart",
    associations: "Ravens - Books - Flame",
  },
  {
    name: "Visions",
    icon: SoothVisions,
    heart: "Empath",
    heartAliases: "aka Waveheart",
    associations: "Swans - Blades - Water",
  },
];

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
          {SOOTH_DATA.map((sooth) => (
            <tr>
              <th scope="row">
                <SoothIcon icon={sooth.icon} description={sooth.name} />
              </th>
              <th>{sooth.name}</th>
              <th>
                <span data-tooltip={sooth.heartAliases}>{sooth.heart}</span>
              </th>
              <th>{sooth.associations}</th>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Trigger a card when...</p>
      <ul>
        <li>Characters move to a new location</li>
        <li>A significant event occurs</li>
        <li>A significant new NPC enters the scene</li>
        <li>A PC suffers a Wound or Anguish</li>
        <li>Something surprising happens</li>
        <li>A GM shift is introduced</li>
        <li>Flux occurs</li>
      </ul>
      <p>
        <em>Rules reference: "The Gate" p. 72</em>
      </p>
    </>
  );
}
