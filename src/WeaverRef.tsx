import {
  append,
  flatten,
  intersection,
  map,
  splitEvery,
  uniq,
  without,
} from "ramda";
import { useCallback, useMemo, useState } from "react";

const RANGES = {
  Touch: 0,
  Close: 1,
  Near: 2,
  Far: 3,
  VeryFar: 4,
};

const DURATIONS = {
  OneRound: 0,
  Short: 1,
  Medium: 2,
  Long: 3,
};

const RANGE_LABELS = ["Touch", "Close", "Near", "Far", "Very Far"];

const DURATION_LABELS = ["One Round", "Short", "Medium", "Long"];

interface WeaverAggregate {
  name: string;
  qualities: string[];
  absences: string[];
  defaultDuration: number;
  defaultRange: number;
}

const WEAVER_AGGREGATES: WeaverAggregate[] = [
  {
    name: "Alleyways",
    qualities: [
      "Stealth",
      "Trickery",
      "Poverty",
      "The lower classes",
      "Rumor",
      "Filth",
      "Whispers",
      "Betrayal",
    ],
    absences: ["Nobility", "Health", "Prestige"],
    defaultDuration: DURATIONS.OneRound,
    defaultRange: RANGES.Touch,
  },
  {
    name: "Blood",
    qualities: [
      "Health",
      "Strength",
      "Vigor",
      "Thirst",
      "Energy",
      "Wounds",
      "Family/Ancestry",
    ],
    absences: ["The dead or undead", "Metal and stone", "Timidity"],
    defaultDuration: DURATIONS.OneRound,
    defaultRange: RANGES.Touch,
  },
  {
    name: "Challenge",
    qualities: [
      "Obstacles",
      "Contests",
      "Battles",
      "Mysteries",
      "Understanding",
      "Purpose",
    ],
    absences: ["Avoidance", "Movement", "Health"],
    defaultDuration: DURATIONS.OneRound,
    defaultRange: RANGES.Touch,
  },
  {
    name: "Darkness",
    qualities: ["Cold", "Stealth", "Decay", "Obfuscation", "Night", "Division"],
    absences: ["Light", "Truth", "Clarity"],
    defaultDuration: DURATIONS.OneRound,
    defaultRange: RANGES.Close,
  },
  {
    name: "Diamond",
    qualities: [
      "Strength",
      "Stone",
      "Hardness",
      "Gravity",
      "Beauty",
      "Wealth",
      "Land",
    ],
    absences: ["Softness", "Absence", "Destruction"],
    defaultDuration: DURATIONS.OneRound,
    defaultRange: RANGES.Touch,
  },
  {
    name: "Fire",
    qualities: [
      "Damage",
      "Destruction",
      "Heat",
      "Illumination",
      "Movement",
      "Passion",
    ],
    absences: ["Water", "Cold", "Building"],
    defaultDuration: DURATIONS.OneRound,
    defaultRange: RANGES.Near,
  },
  {
    name: "Freedom",
    qualities: [
      "Escape",
      "Movement",
      "Destruction",
      "Joy",
      "Distance",
      "Sight",
    ],
    absences: ["Imprisonment", "Despair", "Structure"],
    defaultDuration: DURATIONS.OneRound,
    defaultRange: RANGES.Near,
  },
  {
    name: "Hate",
    qualities: [
      "Damage",
      "Vengeance",
      "Pursuit",
      "Ignorance",
      "Blindness",
      "Time",
    ],
    absences: ["Charm", "Romance", "Health"],
    defaultDuration: DURATIONS.Short,
    defaultRange: RANGES.Touch,
  },
  {
    name: "Heart",
    qualities: [
      "Health",
      "Strength",
      "Courage",
      "Love",
      "Relationships",
      "Interaction",
      "Secrets",
    ],
    absences: ["Violence", "Fear", "Silence"],
    defaultDuration: DURATIONS.OneRound,
    defaultRange: RANGES.Touch,
  },
  {
    name: "Infinity",
    qualities: [
      "Space",
      "Size",
      "Capacity",
      "Duration",
      "Movement",
      "Other universes",
      "Mental damage",
    ],
    absences: ["Captivity", "Endings", "Understanding"],
    defaultDuration: DURATIONS.Short,
    defaultRange: RANGES.Far,
  },
  {
    name: "Lust",
    qualities: [
      "Compulsion",
      "Conjoining",
      "Desire",
      "Attraction",
      "Proximity",
    ],
    absences: ["Hatred", "Absence", "Distance"],
    defaultDuration: DURATIONS.OneRound,
    defaultRange: RANGES.Touch,
  },
  {
    name: "Moonlight",
    qualities: [
      "Illumination",
      "Subtlety",
      "Quiet",
      "Silver",
      "Softness",
      "Deception",
      "Night",
      "Sky",
    ],
    absences: ["Flamboyance", "Sound", "Heat"],
    defaultDuration: DURATIONS.OneRound,
    defaultRange: RANGES.Touch,
  },
  {
    name: "The Sea",
    qualities: [
      "Journeys",
      "Distance",
      "Water",
      "Aquatic creatures",
      "Life",
      "Secrets",
    ],
    absences: ["Stone", "Fire", "Understanding"],
    defaultDuration: DURATIONS.OneRound,
    defaultRange: RANGES.Near,
  },
  {
    name: "Sleep",
    qualities: [
      "Rest",
      "Recuperation",
      "Sleep",
      "Dreams",
      "Nightmare",
      "Immobility",
      "Sloth",
    ],
    absences: ["Action", "Movement", "Clarity"],
    defaultDuration: DURATIONS.Short,
    defaultRange: RANGES.Touch,
  },
  {
    name: "Temptation",
    qualities: [
      "Allure",
      "Value",
      "Corruption",
      "Seduction",
      "Guilt",
      "Obsession",
    ],
    absences: ["Purity", "Calm", "Self-control"],
    defaultDuration: DURATIONS.OneRound,
    defaultRange: RANGES.Touch,
  },
  {
    name: "Thunder",
    qualities: [
      "Power",
      "Sound",
      "Damage",
      "Shaking/Breaking",
      "Movement",
      "Fear",
    ],
    absences: ["Subtlety", "Stealth", "Gentleness"],
    defaultDuration: DURATIONS.OneRound,
    defaultRange: RANGES.Touch,
  },
  {
    name: "The Tower",
    qualities: [
      "Protection",
      "Shelter",
      "Height",
      "Imprisonment",
      "Strength",
      "Stone",
    ],
    absences: ["Movement", "Freedom", "Destruction"],
    defaultDuration: DURATIONS.Short,
    defaultRange: RANGES.Touch,
  },
  {
    name: "Wind",
    qualities: [
      "Speed",
      "Grace",
      "Speech",
      "Breath",
      "Invisibility",
      "Weather",
    ],
    absences: ["Flame", "Stone", "Defense"],
    defaultDuration: DURATIONS.OneRound,
    defaultRange: RANGES.Near,
  },
  {
    name: "Winter",
    qualities: [
      "Cold",
      "Ice",
      "Damage",
      "Silence",
      "Stillness",
      "Endings",
      "Impassivity",
    ],
    absences: ["Warmth", "Motion", "Creation"],
    defaultDuration: DURATIONS.Short,
    defaultRange: RANGES.Touch,
  },
  {
    name: "The Woods",
    qualities: ["Nature", "Plants", "Darkness", "Wood", "Growth", "Mystery"],
    absences: ["Sight", "Clarity", "Death"],
    defaultDuration: DURATIONS.OneRound,
    defaultRange: RANGES.Touch,
  },
];

export default function WeaverRef() {
  const [selectedAggregateNames, setSelectedAggregateNames] = useState<
    string[]
  >([]);

  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [selectedRange, setSelectedRange] = useState<number>(0);

  const selectedAggregates = useMemo(
    () =>
      WEAVER_AGGREGATES.filter((aggregate) =>
        selectedAggregateNames.includes(aggregate.name)
      ),
    [selectedAggregateNames]
  );

  const bestDuration = useMemo(
    () =>
      Math.max(
        ...map((aggregate) => aggregate.defaultDuration, selectedAggregates)
      ),
    [selectedAggregates]
  );

  const bestRange = useMemo(
    () =>
      Math.max(
        ...map((aggregate) => aggregate.defaultDuration, selectedAggregates)
      ),
    [selectedAggregates]
  );

  const qualities = useMemo(
    () =>
      uniq(
        flatten(map((aggregate) => aggregate.qualities, selectedAggregates))
      ),
    [selectedAggregates]
  );

  const absences = useMemo(
    () =>
      uniq(flatten(map((aggregate) => aggregate.absences, selectedAggregates))),
    [selectedAggregates]
  );

  const conflicts = useMemo(
    () => intersection(qualities, absences),
    [qualities, absences]
  );

  const netLevel = useMemo(
    () => selectedDuration - bestDuration + (selectedRange - bestRange),
    [bestDuration, bestRange, selectedDuration, selectedRange]
  );

  const onSelectAggregate: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setSelectedAggregateNames((selected) =>
        e.target.checked
          ? append(e.target.name, selected)
          : without([e.target.name], selected)
      );
    }, []);

  const onChangeDuration: React.ChangeEventHandler<HTMLSelectElement> =
    useCallback((e) => setSelectedDuration(parseInt(e.target.value)), []);

  const onChangeRange: React.ChangeEventHandler<HTMLSelectElement> =
    useCallback((e) => setSelectedRange(parseInt(e.target.value)), []);

  return (
    <>
      <h1>Weaving Effect</h1>
      <fieldset>
        <legend>Aggregates:</legend>
        {splitEvery(6, WEAVER_AGGREGATES).map((aggregates) => (
          <div className="grid">
            {aggregates.map((aggregate) => (
              <div>
                <label>
                  <input
                    type="checkbox"
                    name={aggregate.name}
                    checked={selectedAggregateNames.includes(aggregate.name)}
                    onChange={onSelectAggregate}
                  />
                  {aggregate.name}
                </label>
              </div>
            ))}
          </div>
        ))}
        <table>
          <tbody>
            <tr>
              <td>Duration</td>
              <td>{DURATION_LABELS[bestDuration]}</td>
              <td>
                <select name="duration" onChange={onChangeDuration}>
                  {DURATION_LABELS.map((label, i) => (
                    <option value={i} selected={selectedDuration == i}>
                      {label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>Range</td>
              <td>{RANGE_LABELS[bestRange]}</td>
              <td>
                <select name="range" onChange={onChangeRange}>
                  {RANGE_LABELS.map((label, i) => (
                    <option value={i} selected={selectedRange == i}>
                      {label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          <strong>Net Level:</strong> {netLevel}
        </p>
        <p>
          <strong>Qualities:</strong> {qualities.join(", ")}
        </p>
        <p>
          <strong>Absences:</strong> {absences.join(", ")}
        </p>
        {conflicts.length > 0 && (
          <p>
            <strong>Conflicts:</strong> {conflicts.join(", ")}
          </p>
        )}
      </fieldset>
    </>
  );
}
